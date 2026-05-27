'use client'

import { FoodLogEntry } from '@/types'
import { Trash2 } from 'lucide-react'

interface Props {
  entry: FoodLogEntry
  onDelete: (id: string) => void
}

export default function FoodItem({ entry, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/[0.04] last:border-0">
      <div className="flex-1">
        <div className="text-[14px] text-gray-900">{entry.foodSnapshot.name}</div>
        <div className="text-[12px] text-gray-400 mt-0.5">
          {entry.servings} {entry.foodSnapshot.unit} · P:{entry.totalProtein}g C:{entry.totalCarbs}g F:{entry.totalFat}g
        </div>
      </div>
      <div className="flex items-center gap-3 ml-3">
        <span className="text-[14px] font-semibold text-gray-900">
          {entry.totalKcal} kcal
        </span>
        <button
          onClick={() => onDelete(entry._id)}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 size={14} className="text-gray-300 hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}