'use client'

import { Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  glasses: number
  goal: number
  onUpdate?: (glasses: number) => void
}

export default function WaterTracker({ glasses, goal, onUpdate }: Props) {
  const dots = Array.from({ length: goal }, (_, i) => i < glasses)

  const handleTap = (index: number) => {
    if (!onUpdate) return
    const newVal = index < glasses ? index : index + 1
    onUpdate(newVal)
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={15} className="text-[#378ADD]" />
          <span className="text-[13px] font-semibold text-gray-800">Water</span>
        </div>
        <span className="text-[12px] text-gray-400">
          {glasses} / {goal} glasses
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {dots.map((filled, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            aria-label={`Glass ${i + 1}`}
            className={cn(
              'w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center',
              filled
                ? 'bg-[#E6F1FB] border-[#85B7EB]'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            )}
          >
            <Droplets
              size={13}
              className={filled ? 'text-[#185FA5]' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    </div>
  )
}