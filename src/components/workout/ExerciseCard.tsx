'use client'

import { useState } from 'react'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { Exercise } from '@/types'
import SetLogger from './SetLogger'
import ProgressOverloadBadge from './ProgressOverloadBadge'
import { useExerciseHistory } from '@/lib/queries/useWorkout'
import { cn } from '@/lib/utils'

interface Props {
  exercise: Exercise
  savedSets?: any[]
  onSave: (exerciseName: string, sets: any[]) => void
}

export default function ExerciseCard({ exercise, savedSets, onSave }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { data: history }         = useExerciseHistory(exercise.name)

  const lastSession = history?.history?.[0]
  const lastSets    = lastSession?.exercise?.sets ?? []
  const pr          = history?.pr ?? 0
  const isDone      = savedSets && savedSets.length > 0
  const completedSets = savedSets?.filter((s: any) => s.completed).length ?? 0

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className={cn(
          'w-full text-left rounded-2xl border p-4 shadow-sm transition-all active:scale-[0.98]',
          isDone
            ? 'bg-[#F0FAF5] border-[#C0DD97]'
            : 'bg-white border-black/[0.06]'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isDone && <CheckCircle2 size={16} className="text-[#1D9E75]" />}
            <span className="text-[14px] font-semibold text-gray-900">
              {exercise.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isDone && (
              <span className="text-[11px] font-medium text-[#1D9E75] bg-[#EAF3DE] px-2 py-0.5 rounded-full">
                {completedSets}/{savedSets?.length} sets
              </span>
            )}
            <ChevronRight size={15} className="text-gray-300" />
          </div>
        </div>

        <div className="text-[12px] text-gray-400 mb-2 capitalize">
          {exercise.muscleGroup} · {exercise.defaultSets}×{exercise.defaultReps} @ {exercise.defaultWeightKg}kg
        </div>

        {lastSets.length > 0 && (
          <ProgressOverloadBadge
            lastWeight={lastSets[0]?.weightKg ?? 0}
            lastReps={lastSets[0]?.reps ?? 0}
            lastSets={lastSets.length}
            pr={pr}
          />
        )}
      </button>

      <SetLogger
        exerciseName={exercise.name}
        muscleGroup={exercise.muscleGroup}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(sets) => {
          onSave(exercise.name, sets)
          setSheetOpen(false)
        }}
      />
    </>
  )
}