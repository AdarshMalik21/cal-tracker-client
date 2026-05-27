'use client'

import { useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Star, Sparkles } from 'lucide-react'
import { useCreateFood, useFoods, useSavedMeals } from '@/lib/queries/useFoods'
import { Food, MealType } from '@/types'
import { cn } from '@/lib/utils'
import ServingsModal from './ServingsModal'
import { toast } from 'sonner'

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'my meals', label: 'My meals' },
    { key: 'protein', label: 'Protein' },
    { key: 'carbs', label: 'Carbs' },
    { key: 'dairy', label: 'Dairy' },
    { key: 'fruits', label: 'Fruits' },
]

interface Props {
    open: boolean
    mealType: MealType
    onClose: () => void
    onAdd: (food: Food, servings: number) => void
}

export default function FoodSearchSheet({ open, mealType, onClose, onAdd }: Props) {
    const [search, setSearch] = useState('')
    const [tab, setTab] = useState('all')
    const [selected, setSelected] = useState<Food | null>(null)
    const [showCustomDish, setShowCustomDish] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [customDish, setCustomDish] = useState({
        name: '',
        unit: 'piece',
        kcal: '',
        protein: '',
        carbs: '',
        fat: '',
    })

    const { data: foods = [], isLoading } = useFoods(search, tab === 'my meals' ? '' : tab)
    const { data: saved = [] } = useSavedMeals()
    const createFood = useCreateFood()

    const displayed = tab === 'my meals' ? saved : foods

    const mealLabel = mealType.replace('_', ' ')

    const canSubmitCustomDish = useMemo(() => {
        return (
            customDish.name.trim().length > 0 &&
            customDish.unit.trim().length > 0 &&
            customDish.kcal !== '' &&
            customDish.protein !== '' &&
            customDish.carbs !== '' &&
            customDish.fat !== ''
        )
    }, [customDish])

    const resetCustomDish = () => {
        setCustomDish({
            name: '',
            unit: 'piece',
            kcal: '',
            protein: '',
            carbs: '',
            fat: '',
        })
    }

    const handleCreateCustomDish = async () => {
        if (!canSubmitCustomDish || isSubmitting) return

        try {
            setIsSubmitting(true)
            const res = await createFood.mutateAsync({
                name: customDish.name.trim(),
                unit: customDish.unit.trim(),
                kcal: Number(customDish.kcal),
                protein: Number(customDish.protein),
                carbs: Number(customDish.carbs),
                fat: Number(customDish.fat),
                tag: 'custom',
                aliases: [],
            })

            const createdFood = res.data.data as Food
            toast.success(`${createdFood.name} added`)
            onAdd(createdFood, 1)
            resetCustomDish()
            setShowCustomDish(false)
            onClose()
        } catch (err) {
            toast.error('Failed to add custom food')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Sheet
                open={open}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) onClose()
                }}
            >
                <SheetContent side="bottom" className="rounded-t-3xl h-[90dvh]! w-full px-0 pb-0 flex flex-col min-h-0 overflow-hidden touch-pan-y">
                    <SheetTitle className="sr-only">Add food to {mealLabel}</SheetTitle>
                    <SheetDescription className="sr-only">
                        Search foods and choose an item to set serving size before adding it.
                    </SheetDescription>
                    {/* handle */}
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-0 shrink-0" />

                    {/* header */}
                    <div className="px-5 pt-3 pb-3 shrink-0">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <h3 className="text-[17px] font-semibold text-gray-900">
                                Add to {mealLabel}
                            </h3>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowCustomDish(v => !v)}
                                className="h-8 rounded-full px-3"
                            >
                                <Sparkles size={14} />
                                Custom food
                            </Button>
                        </div>

                        {showCustomDish && (
                            <div className="mb-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                                <div className="grid grid-cols-1 gap-2.5">
                                    <Input
                                        placeholder="Food name"
                                        value={customDish.name}
                                        onChange={e => setCustomDish(prev => ({ ...prev, name: e.target.value }))}
                                        className="h-9 rounded-xl bg-background"
                                    />
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Input
                                            placeholder="Unit (plate, bowl)"
                                            value={customDish.unit}
                                            onChange={e => setCustomDish(prev => ({ ...prev, unit: e.target.value }))}
                                            className="h-9 rounded-xl bg-background"
                                        />
                                        <Input
                                            placeholder="Calories"
                                            inputMode="numeric"
                                            value={customDish.kcal}
                                            onChange={e => setCustomDish(prev => ({ ...prev, kcal: e.target.value.replace(/[^0-9.]/g, '') }))}
                                            className="h-9 rounded-xl bg-background"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        <Input
                                            placeholder="Protein"
                                            inputMode="numeric"
                                            value={customDish.protein}
                                            onChange={e => setCustomDish(prev => ({ ...prev, protein: e.target.value.replace(/[^0-9.]/g, '') }))}
                                            className="h-9 rounded-xl bg-background"
                                        />
                                        <Input
                                            placeholder="Carbs"
                                            inputMode="numeric"
                                            value={customDish.carbs}
                                            onChange={e => setCustomDish(prev => ({ ...prev, carbs: e.target.value.replace(/[^0-9.]/g, '') }))}
                                            className="h-9 rounded-xl bg-background"
                                        />
                                        <Input
                                            placeholder="Fat"
                                            inputMode="numeric"
                                            value={customDish.fat}
                                            onChange={e => setCustomDish(prev => ({ ...prev, fat: e.target.value.replace(/[^0-9.]/g, '') }))}
                                            className="h-9 rounded-xl bg-background"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-9 flex-1 rounded-xl"
                                            onClick={() => {
                                                setShowCustomDish(false)
                                                resetCustomDish()
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="h-9 flex-1 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                                            onClick={handleCreateCustomDish}
                                            disabled={!canSubmitCustomDish || isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save and add'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search foods, dishes, dal, eggs..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 rounded-xl border-gray-200 bg-gray-50 text-[14px]"
                            />
                        </div>
                    </div>

                    {/* tabs */}
                    <div className="px-5 flex gap-2 overflow-x-auto pb-3 shrink-0 scrollbar-hide">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors shrink-0',
                                    tab === t.key
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* food list */}
                    <div className="flex-1 min-h-0 overflow-y-scroll overscroll-contain touch-pan-y px-5 pb-4">
                        {isLoading ? (
                            <div className="space-y-3 pt-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : displayed.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-2">
                                <p className="text-gray-400 text-[14px]">No foods found</p>
                                {search && (
                                    <p className="text-gray-300 text-[12px]">Try a different search</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-0 divide-y divide-black/4 pb-6">
                                {displayed.map(food => (
                                    <button
                                        key={food._id}
                                        onClick={() => setSelected(food)}
                                        className="w-full flex items-center justify-between py-3.5 text-left active:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                {food.isSavedMeal && (
                                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                                )}
                                                <span className="text-[14px] text-gray-900">{food.name}</span>
                                            </div>
                                            <span className="text-[12px] text-gray-400">
                                                P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                                            </span>
                                        </div>
                                        <div className="text-right ml-3 shrink-0">
                                            <div className="text-[15px] font-semibold text-gray-900">
                                                {food.kcal}
                                            </div>
                                            <div className="text-[11px] text-gray-400">per {food.unit}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <ServingsModal
                food={selected}
                mealType={mealType}
                open={!!selected}
                onClose={() => setSelected(null)}
                onConfirm={(food, servings) => {
                    onAdd(food, servings)
                    setSelected(null)
                    onClose()
                }}
            />
        </>
    )
}