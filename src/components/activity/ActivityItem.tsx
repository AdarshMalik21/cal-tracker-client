'use client'

import { Flame, Trash2, Clock } from 'lucide-react'
import { ActivityLogEntry } from '@/types'

interface Props {
  entry: ActivityLogEntry
  onDelete: (id: string) => void
}

export default function ActivityItem({ entry, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/[0.04] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
          <Flame size={16} className="text-[#E05C2A]" />
        </div>
        <div>
          <div className="text-[14px] text-gray-900">{entry.activitySnapshot.name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={11} className="text-gray-300" />
            <span className="text-[12px] text-gray-400">{entry.durationMinutes} min</span>
            <span className="text-gray-200">·</span>
            <span className="text-[12px] text-gray-400 capitalize">
              {entry.activitySnapshot.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-3">
        <span className="text-[14px] font-semibold text-[#E05C2A]">
          −{entry.caloriesBurned} kcal
        </span>
        <button
          onClick={() => onDelete(entry._id)}
          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Delete activity"
        >
          <Trash2 size={14} className="text-gray-300 hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}