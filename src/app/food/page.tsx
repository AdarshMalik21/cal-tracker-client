'use client'

import { useState }        from 'react'
import { toast }           from 'sonner'
import MobileShell         from '@/components/layout/MobileShell'
import PageHeader          from '@/components/layout/PageHeader'
import MealSection         from '@/components/food/MealSection'
import FoodSearchSheet     from '@/components/food/FoodSearchSheet'
import { useDateStore }    from '@/lib/store/useDateStore'
import { useFoodLog, useAddFoodLog, useDeleteFoodLog } from '@/lib/queries/useFoods'
import { MealType, Food }  from '@/types'
import { Skeleton }        from '@/components/ui/skeleton'
import { UtensilsCrossed } from 'lucide-react'

const MEAL_TYPES: MealType[] = [
  'breakfast', 'lunch', 'dinner', 'pre_workout', 'post_workout', 'snacks',
]

export default function FoodPage() {
  const { selectedDate }   = useDateStore()
  const [sheetOpen, setSheetOpen]     = useState(false)
  const [activeMeal, setActiveMeal]   = useState<MealType>('breakfast')

  const { data, isLoading }  = useFoodLog(selectedDate)
  const addFoodLog           = useAddFoodLog()
  const deleteFoodLog        = useDeleteFoodLog()

  const handleAdd = (mealType: MealType) => {
    setActiveMeal(mealType)
    setSheetOpen(true)
  }

  const handleConfirm = async (food: Food, servings: number) => {
    try {
      await addFoodLog.mutateAsync({
        foodId:   food._id,
        mealType: activeMeal,
        servings,
        date:     selectedDate,
      })
      toast.success(`${food.name} added to ${activeMeal.replace('_', ' ')}`)
    } catch {
      toast.error('Failed to add food')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFoodLog.mutateAsync({ id, date: selectedDate })
      toast.success('Entry removed')
    } catch {
      toast.error('Failed to delete entry')
    }
  }

  const grouped = data?.grouped ?? {
    breakfast: [], lunch: [], dinner: [],
    pre_workout: [], post_workout: [], snacks: [],
  }

  const totals = data?.totals ?? { kcal: 0, protein: 0, carbs: 0, fat: 0 }

  return (
    <MobileShell>
      <PageHeader
        title="Food log"
        showDateNav
        right={
          totals.kcal > 0 ? (
            <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-full">
              <UtensilsCrossed size={12} />
              <span className="text-[12px] font-semibold">{totals.kcal} kcal</span>
            </div>
          ) : null
        }
      />

      {/* daily macro summary */}
      {totals.kcal > 0 && (
        <div className="mx-4 mt-2 mb-3 flex gap-2">
          {[
            { label: 'P', value: totals.protein, color: '#1D9E75' },
            { label: 'C', value: totals.carbs,   color: '#378ADD' },
            { label: 'F', value: totals.fat,      color: '#EF9F27' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex-1 bg-white rounded-xl border border-black/[0.06] px-3 py-2 text-center shadow-sm"
            >
              <div className="text-[16px] font-bold" style={{ color }}>{value}g</div>
              <div className="text-[10px] text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* meal sections */}
      {isLoading ? (
        <div className="mx-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mx-4 space-y-3 mb-4">
          {MEAL_TYPES.map(mealType => (
            <MealSection
              key={mealType}
              mealType={mealType}
              entries={grouped[mealType] ?? []}
              onAdd={handleAdd}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* food search sheet */}
      <FoodSearchSheet
        open={sheetOpen}
        mealType={activeMeal}
        onClose={() => setSheetOpen(false)}
        onAdd={handleConfirm}
      />
    </MobileShell>
  )
}