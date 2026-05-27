'use client'

import { useRouter } from 'next/navigation'
import { Dumbbell, ChevronRight, CheckCircle2 } from 'lucide-react'
import { PlanDay } from '@/types'

interface Props {
  todaysPlan: PlanDay | null
  workoutDone: boolean
}

export default function TodayWorkoutCard({ todaysPlan, workoutDone }: Props) {
  const router = useRouter()

  if (!todaysPlan) return null

  const isRest = todaysPlan.dayType === 'rest'

  return (
    <button
      onClick={() => !isRest && router.push('/workout')}
      className="w-full text-left bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: isRest ? '#F3F4F6' : '#EAF3DE' }}
          >
            {workoutDone ? (
              <CheckCircle2 size={20} className="text-[#1D9E75]" />
            ) : (
              <Dumbbell size={20} className={isRest ? 'text-gray-400' : 'text-[#1D9E75]'} />
            )}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-gray-900">
              {isRest ? 'Rest day' : `${todaysPlan.dayName} day`}
            </div>
            <div className="text-[12px] text-gray-400 mt-0.5">
              {isRest
                ? 'Recovery & mobility'
                : todaysPlan.muscleGroups.join(' · ')}
            </div>
          </div>
        </div>
        {!isRest && (
          <ChevronRight size={18} className="text-gray-300" />
        )}
      </div>

      {!isRest && !workoutDone && todaysPlan.exercises.length > 0 && (
        <div className="mt-3 pt-3 border-t border-black/[0.04]">
          <div className="text-[11px] text-gray-400 mb-1.5">
            {todaysPlan.exercises.length} exercises
          </div>
          <div className="flex flex-wrap gap-1.5">
            {todaysPlan.exercises.slice(0, 4).map((ex, i) => (
              <span
                key={i}
                className="text-[11px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100"
              >
                {ex.name}
              </span>
            ))}
            {todaysPlan.exercises.length > 4 && (
              <span className="text-[11px] text-gray-400 px-1">
                +{todaysPlan.exercises.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </button>
  )
}