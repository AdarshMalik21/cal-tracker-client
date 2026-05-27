'use client'

import { Macros, MacroGoals } from '@/types'
import { getProgressPercent } from '@/lib/utils'

interface Props {
  macros: Macros
  goals: MacroGoals
}

const MACRO_CONFIG = [
  { key: 'protein' as const, label: 'Protein', unit: 'g', color: '#1D9E75' },
  { key: 'carbs'   as const, label: 'Carbs',   unit: 'g', color: '#378ADD' },
  { key: 'fat'     as const, label: 'Fat',      unit: 'g', color: '#EF9F27' },
]

export default function MacroRings({ macros, goals }: Props) {
  return (
    <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
      {MACRO_CONFIG.map(({ key, label, unit, color }) => {
        const current = macros[key]
        const goal    = goals[key]
        const pct     = getProgressPercent(current, goal)

        return (
          <div
            key={key}
            className="bg-white rounded-2xl border border-black/[0.06] p-3 shadow-sm"
          >
            <div className="text-[11px] text-gray-400 mb-1">{label}</div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[18px] font-bold text-gray-900">{current}</span>
              <span className="text-[10px] text-gray-400">{unit}</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1.5">/ {goal}{unit}</div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}