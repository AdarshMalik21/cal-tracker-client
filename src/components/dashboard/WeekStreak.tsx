'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  streak: number
  gymSessions: number
  targetSessions: number
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function WeekStreak({ streak, gymSessions, targetSessions }: Props) {
  const today     = new Date().getDay()
  const daysSoFar = today === 0 ? 6 : today - 1   // Mon=0 ... Sun=6

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-gray-800">This week</span>
        <span className="text-[12px] text-gray-400">
          {gymSessions}/{targetSessions} sessions
        </span>
      </div>
      <div className="flex justify-between mb-3">
        {DAYS.map((day, i) => {
          const isPast   = i < daysSoFar
          const isToday  = i === daysSoFar
          const hasLog   = i < streak

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400">{day}</span>
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  hasLog
                    ? 'bg-[#1D9E75] border-2 border-[#1D9E75]'
                    : isToday
                    ? 'border-2 border-[#1D9E75] bg-white'
                    : isPast
                    ? 'bg-gray-100 border-2 border-gray-100'
                    : 'border border-gray-200 bg-white'
                )}
              >
                {hasLog ? (
                  <Check size={13} className="text-white" strokeWidth={2.5} />
                ) : (
                  <span className={cn(
                    'text-[11px] font-medium',
                    isToday ? 'text-[#1D9E75]' : 'text-gray-300'
                  )}>
                    {i + 1}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {streak > 0 && (
        <div className="text-center text-[12px] text-gray-500">
          {streak}-day streak — keep going!
        </div>
      )}
    </div>
  )
}