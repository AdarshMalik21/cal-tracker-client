'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Plus, Trash2, Check } from 'lucide-react'
import { useExerciseHistory } from '@/lib/queries/useWorkout'
import ProgressOverloadBadge from './ProgressOverloadBadge'
import { cn } from '@/lib/utils'

interface SetRow {
  setNumber: number
  weightKg: number
  reps: number
  completed: boolean
}

interface Props {
  exerciseName: string
  muscleGroup: string
  open: boolean
  onClose: () => void
  onSave: (sets: SetRow[]) => void
}

export default function SetLogger({ exerciseName, muscleGroup, open, onClose, onSave }: Props) {
  const { data: history } = useExerciseHistory(exerciseName)

  const lastSession = history?.history?.[0]
  const lastSets = lastSession?.exercise?.sets ?? []
  const pr = history?.pr ?? 0

  const defaultWeight = lastSets[0]?.weightKg ?? 0
  const defaultReps = lastSets[0]?.reps ?? 10

  const [sets, setSets] = useState<SetRow[]>([
    { setNumber: 1, weightKg: defaultWeight, reps: defaultReps, completed: false },
    { setNumber: 2, weightKg: defaultWeight, reps: defaultReps, completed: false },
    { setNumber: 3, weightKg: defaultWeight, reps: defaultReps, completed: false },
  ])

  const updateSet = (index: number, field: keyof SetRow, value: number | boolean) => {
    setSets(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const addSet = () => {
    setSets(prev => [
      ...prev,
      { setNumber: prev.length + 1, weightKg: defaultWeight, reps: defaultReps, completed: false },
    ])
  }

  const removeSet = (index: number) => {
    setSets(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, setNumber: i + 1 }))
    )
  }

  const completedCount = sets.filter(s => s.completed).length

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 px-5 max-h-[85dvh] overflow-y-auto">
        <SheetTitle className="sr-only">{exerciseName} sets</SheetTitle>
        <SheetDescription className="sr-only">
          Log weight, reps, and completion for the {muscleGroup} exercise.
        </SheetDescription>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-4" />

        {/* header */}
        <div className="mb-4">
          <h3 className="text-[17px] font-semibold text-gray-900">{exerciseName}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5 capitalize">{muscleGroup}</p>
        </div>

        {/* previous session badge */}
        {lastSets.length > 0 && (
          <div className="mb-4">
            <ProgressOverloadBadge
              lastWeight={lastSets[0]?.weightKg ?? 0}
              lastReps={lastSets[0]?.reps ?? 0}
              lastSets={lastSets.length}
              pr={pr}
            />
          </div>
        )}

        {/* column headers */}
        <div className="grid grid-cols-[1.25rem_minmax(0,0.9fr)_minmax(0,0.9fr)_2rem_1.25rem] items-center gap-1.5 mb-2 px-0.5 sm:grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_2.25rem_1.5rem] sm:gap-2 sm:px-1">
          <span className="text-[11px] text-gray-400 text-center">Set</span>
          <span className="text-[11px] text-gray-400 text-center">kg</span>
          <span className="text-[11px] text-gray-400 text-center">reps</span>
          <span className="text-[11px] text-gray-400 text-center">done</span>
          <span />
        </div>

        {/* set rows */}
        <div className="space-y-2 mb-4">
          {sets.map((set, i) => (
            <div
              key={i}
              className={cn(
                'grid grid-cols-[1.25rem_minmax(0,0.9fr)_minmax(0,0.9fr)_2rem_1.25rem] items-center gap-1.5 px-2.5 py-2.25 rounded-xl border transition-all sm:grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_2.25rem_1.5rem] sm:gap-2 sm:px-3 sm:py-2.5',
                set.completed
                  ? 'bg-[#EAF3DE] border-[#C0DD97]'
                  : 'bg-gray-50 border-gray-100'
              )}
            >
              <span className="text-[12px] sm:text-[13px] font-medium text-gray-400 text-center">{set.setNumber}</span>

              <input
                type="number"
                value={set.weightKg}
                onChange={e => updateSet(i, 'weightKg', parseFloat(e.target.value) || 0)}
                className="min-w-0 w-full appearance-none text-center text-[14px] sm:text-[15px] font-semibold bg-transparent border-none outline-none text-gray-900"
                step="2.5"
                min="0"
              />

              <input
                type="number"
                value={set.reps}
                onChange={e => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
                className="min-w-0 w-full appearance-none text-center text-[14px] sm:text-[15px] font-semibold bg-transparent border-none outline-none text-gray-900"
                min="1"
              />

              <button
                onClick={() => updateSet(i, 'completed', !set.completed)}
                className={cn(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center justify-self-center transition-all',
                  set.completed
                    ? 'bg-[#1D9E75] border-[#1D9E75]'
                    : 'border-gray-300 bg-white'
                )}
              >
                {set.completed && <Check size={13} className="text-white" strokeWidth={2.5} />}
              </button>

              <button
                onClick={() => removeSet(i)}
                className="w-5 sm:w-6 flex items-center justify-center justify-self-center"
              >
                <Trash2 size={12} className="text-gray-300 hover:text-red-400 transition-colors" />
              </button>
            </div>
          ))}
        </div>

        {/* add set */}
        <button
          onClick={addSet}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-gray-400 text-[13px] hover:border-gray-300 transition-colors mb-4"
        >
          <Plus size={14} />
          Add set
        </button>

        {/* save */}
        <button
          onClick={() => { onSave(sets); onClose() }}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
        >
          Save sets {completedCount > 0 && `· ${completedCount}/${sets.length} done`}
        </button>
      </SheetContent>
    </Sheet>
  )
}