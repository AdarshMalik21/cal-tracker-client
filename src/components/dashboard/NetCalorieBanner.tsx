'use client'

import { TodayData } from '@/types'
import { getSurplusLabel, getProgressPercent } from '@/lib/utils'
import { Flame, UtensilsCrossed } from 'lucide-react'

interface Props {
  today: TodayData
}

export default function NetCalorieBanner({ today }: Props) {
  const { caloriesEaten, caloriesBurned, netCalories, calorieGoal, surplus } = today
  const { label, color, bg } = getSurplusLabel(surplus)
  const pct = getProgressPercent(netCalories, calorieGoal)

  return (
    <div className="mx-4 mt-3 bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed size={14} className="text-gray-400" />
            <span className="text-[13px] text-gray-500">Eaten</span>
          </div>
          <span className="text-[14px] font-semibold text-gray-900">
            {caloriesEaten.toLocaleString()} kcal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-[#E05C2A]" />
            <span className="text-[13px] text-gray-500">Burned</span>
          </div>
          <span className="text-[14px] font-semibold text-[#E05C2A]">
            -{caloriesBurned.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-px bg-black/[0.06] mb-3" />

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[13px] text-gray-500">Net calories</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[26px] font-bold text-gray-900 leading-none">
              {netCalories.toLocaleString()}
            </span>
            <span className="text-[13px] text-gray-400">
              / {calorieGoal.toLocaleString()} goal
            </span>
          </div>
        </div>
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ color, background: bg }}
        >
          {label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: '#1D9E75' }}
          />
        </div>
      </div>
    </div>
  )
}