'use client'

import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { FoodLogEntry, MealType } from '@/types'
import FoodItem from './FoodItem'
import { cn } from '@/lib/utils'

interface Props {
  mealType: MealType
  entries: FoodLogEntry[]
  onAdd: (mealType: MealType) => void
  onDelete: (id: string) => void
}

const MEAL_CONFIG: Record<MealType, { label: string; emoji: string; color: string }> = {
  breakfast:    { label: 'Breakfast',     emoji: '🌅', color: '#F59E0B' },
  lunch:        { label: 'Lunch',         emoji: '☀️',  color: '#10B981' },
  dinner:       { label: 'Dinner',        emoji: '🌙', color: '#6366F1' },
  pre_workout:  { label: 'Pre-workout',   emoji: '⚡',  color: '#3B82F6' },
  post_workout: { label: 'Post-workout',  emoji: '💪', color: '#1D9E75' },
  snacks:       { label: 'Snacks',        emoji: '🥜', color: '#EF9F27' },
}

export default function MealSection({ mealType, entries, onAdd, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const config    = MEAL_CONFIG[mealType]
  const totalKcal = entries.reduce((a, e) => a + e.totalKcal, 0)
  const hasItems  = entries.length > 0

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
      {/* meal header */}
      <button
        onClick={() => hasItems && setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[18px]">{config.emoji}</span>
          <span className="text-[14px] font-semibold text-gray-900">{config.label}</span>
          {hasItems && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {entries.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalKcal > 0 && (
            <span className="text-[13px] font-semibold text-gray-700">
              {totalKcal} kcal
            </span>
          )}
          {hasItems && (
            collapsed
              ? <ChevronDown size={15} className="text-gray-300" />
              : <ChevronUp size={15} className="text-gray-300" />
          )}
        </div>
      </button>

      {/* entries */}
      {!collapsed && (
        <div className={cn('px-4', hasItems ? 'pb-2' : '')}>
          {entries.map(entry => (
            <FoodItem key={entry._id} entry={entry} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* add button */}
      {!collapsed && (
        <button
          onClick={() => onAdd(mealType)}
          className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-gray-50 transition-colors border-t border-black/[0.04]"
        >
          <Plus size={15} />
          <span className="text-[13px]">Add food</span>
        </button>
      )}
    </div>
  )
}