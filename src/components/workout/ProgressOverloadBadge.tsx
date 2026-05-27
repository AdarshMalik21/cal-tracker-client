'use client'

import { TrendingUp, Trophy } from 'lucide-react'

interface Props {
  lastWeight: number
  lastReps: number
  lastSets: number
  pr: number
}

export default function ProgressOverloadBadge({ lastWeight, lastReps, lastSets, pr }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
        <TrendingUp size={11} className="text-blue-500" />
        <span className="text-[11px] font-medium text-blue-600">
          Last: {lastSets}×{lastReps} @ {lastWeight}kg
        </span>
      </div>
      {pr > 0 && (
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
          <Trophy size={11} className="text-amber-500" />
          <span className="text-[11px] font-medium text-amber-600">
            PR: {pr}kg
          </span>
        </div>
      )}
    </div>
  )
}