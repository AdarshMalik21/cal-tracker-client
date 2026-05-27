'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const MUSCLES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core']

const LEVEL_COLORS = ['', '#1D9E75', '#1D9E75', '#EF9F27', '#E05C2A', '#A32D2D']
const LEVEL_LABELS = ['', 'Fine', 'Mild', 'Moderate', 'Sore', 'Very sore']

interface Props {
  initial?: { name: string; level: number }[]
  onChange: (muscles: { name: string; level: number }[]) => void
}

export default function SorenessRater({ initial = [], onChange }: Props) {
  const initMap: Record<string, number> = {}
  initial.forEach(m => { initMap[m.name] = m.level })

  const [levels, setLevels] = useState<Record<string, number>>(initMap)

  const setLevel = (muscle: string, level: number) => {
    const updated = { ...levels, [muscle]: level }
    setLevels(updated)
    onChange(
      Object.entries(updated).map(([name, lvl]) => ({ name, level: lvl }))
    )
  }

  const hasWarning = Object.values(levels).some(l => l >= 4)

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-semibold text-gray-800">Muscle soreness</span>
        {hasWarning && (
          <div className="flex items-center gap-1 text-[11px] text-[#E05C2A]">
            <AlertTriangle size={12} />
            <span>Skip sore muscles</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400 mb-4">
        Rate 1–5. Level 4+ = rest that muscle today.
      </p>

      <div className="space-y-3">
        {MUSCLES.map(muscle => {
          const level = levels[muscle] ?? 0
          return (
            <div key={muscle} className="flex items-center gap-3">
              <span className="text-[13px] text-gray-700 w-20 flex-shrink-0">{muscle}</span>
              <div className="flex gap-1.5 flex-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setLevel(muscle, level === n ? 0 : n)}
                    className={cn(
                      'flex-1 h-7 rounded-lg text-[11px] font-medium transition-all border',
                      level >= n
                        ? 'text-white border-transparent'
                        : 'bg-gray-50 text-gray-300 border-gray-100'
                    )}
                    style={level >= n ? { background: LEVEL_COLORS[n] } : {}}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {level >= 4 && (
                <span className="text-[10px] text-[#E05C2A] font-medium w-14 text-right flex-shrink-0">
                  Rest!
                </span>
              )}
              {level > 0 && level < 4 && (
                <span className="text-[10px] text-gray-400 w-14 text-right flex-shrink-0">
                  {LEVEL_LABELS[level]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}