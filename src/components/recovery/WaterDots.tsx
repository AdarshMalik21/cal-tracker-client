'use client'

import { Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  glasses: number
  goal: number
  onChange: (glasses: number) => void
}

export default function WaterDots({ glasses, goal, onChange }: Props) {
  const pct = Math.round((glasses / goal) * 100)

  const waterLabel =
    glasses === 0       ? 'Start drinking!'          :
    glasses < goal * 0.5 ? 'Keep going'              :
    glasses < goal      ? 'Almost there'             :
                          'Goal reached!'

  const waterColor =
    glasses < goal * 0.5 ? '#EF9F27' :
    glasses < goal       ? '#378ADD' :
                           '#1D9E75'

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={15} className="text-[#378ADD]" />
          <span className="text-[13px] font-semibold text-gray-800">Water intake</span>
        </div>
        <div className="text-right">
          <span className="text-[13px] font-bold" style={{ color: waterColor }}>
            {glasses}
          </span>
          <span className="text-[12px] text-gray-400"> / {goal} glasses</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {Array.from({ length: goal }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < glasses ? i : i + 1)}
            aria-label={`Glass ${i + 1}`}
            className={cn(
              'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all active:scale-95',
              i < glasses
                ? 'bg-[#E6F1FB] border-[#85B7EB]'
                : 'bg-gray-50 border-gray-200'
            )}
          >
            <Droplets
              size={14}
              className={i < glasses ? 'text-[#185FA5]' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: waterColor }}>{waterLabel}</p>
        <span className="text-[11px] text-gray-300">{pct}%</span>
      </div>
    </div>
  )
}