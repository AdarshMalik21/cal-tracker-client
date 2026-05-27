'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import MobileShell from '@/components/layout/MobileShell'
import PageHeader from '@/components/layout/PageHeader'
import ExerciseCard from '@/components/workout/ExerciseCard'
import { useDateStore } from '@/lib/store/useDateStore'
import {
  useTodayWorkout,
  useWorkoutLog,
  useCreateWorkoutLog,
  useUpdateWorkoutLog,
  useDeleteWorkoutLog,
  useAdvanceWorkoutDay,
  useSetWorkoutDay,
} from '@/lib/queries/useWorkout'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, Timer, Dumbbell, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WorkoutPage() {
  const { selectedDate } = useDateStore()
  const { data: todayData, isLoading: planLoading } = useTodayWorkout()
  const { data: logs = [] } = useWorkoutLog(selectedDate)
  const createLog = useCreateWorkoutLog()
  const updateLog = useUpdateWorkoutLog()
  const deleteLog = useDeleteWorkoutLog()
  const advanceWorkoutDay = useAdvanceWorkoutDay()
  const setWorkoutDay = useSetWorkoutDay()

  const [exercises, setExercises] = useState<Record<string, any[]>>({})
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const todayPlan = todayData?.today
  const planDays = todayData?.plan?.days ?? []
  const currentPlanDayIndex = todayData?.currentPlanDayIndex ?? 0
  const isRest = todayPlan?.dayType === 'rest'
  const existingLog = logs[0] ?? null

  // load saved exercises from existing log
  useEffect(() => {
    if (existingLog) {
      const map: Record<string, any[]> = {}
      existingLog.exercises.forEach((ex: any) => { map[ex.name] = ex.sets })
      setExercises(map)
      setStarted(true)
    }
  }, [existingLog])

  // timer
  useEffect(() => {
    if (started && !existingLog) {
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const handleSaveExercise = (name: string, sets: any[]) => {
    setExercises(prev => ({ ...prev, [name]: sets }))
    toast.success(`${name} saved`)
  }

  const handleStartWorkout = () => {
    setStarted(true)
    toast.success('Workout started — let\'s go!')
  }

  const handleResetWorkout = async () => {
    const hasSavedLog = !!existingLog

    if (hasSavedLog) {
      const shouldDelete = window.confirm(
        'This will delete the saved workout log for today and clear your current session. Continue?'
      )

      if (!shouldDelete) return

      try {
        await deleteLog.mutateAsync({ id: existingLog._id, date: selectedDate })
      } catch {
        toast.error('Failed to reset workout')
        return
      }
    }

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    startTimeRef.current = 0
    setExercises({})
    setStarted(false)
    setElapsed(0)

    toast.success(hasSavedLog ? 'Workout reset' : 'Workout cleared')
  }

  const handleFinishWorkout = async () => {
    if (!todayPlan) return

    const exercisePayload = todayPlan.exercises.map((ex: any) => ({
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: exercises[ex.name] ?? [],
      notes: '',
    }))

    const durationMinutes = existingLog
      ? existingLog.durationMinutes
      : Math.floor(elapsed / 60)

    try {
      if (existingLog) {
        await updateLog.mutateAsync({
          id: existingLog._id,
          exercises: exercisePayload,
          durationMinutes,
          date: selectedDate,
        })
      } else {
        await createLog.mutateAsync({
          planId: todayData?.plan?._id,
          planDayId: todayPlan._id,
          workoutName: `${todayPlan.dayName} day`,
          muscleGroups: todayPlan.muscleGroups,
          exercises: exercisePayload,
          durationMinutes,
          date: selectedDate,
        })
      }
    } catch {
      toast.error('Failed to save workout')
      return
    }

    try {
      await advanceWorkoutDay.mutateAsync()
    } catch {
      if (timerRef.current) clearInterval(timerRef.current)
      toast.success('Workout saved!')
      toast.error('Saved, but failed to advance workout day')
      return
    }

    if (timerRef.current) clearInterval(timerRef.current)
    toast.success('Workout saved!')
  }

  const handleSwitchWorkout = async (dayIndex: number) => {
    try {
      await setWorkoutDay.mutateAsync({ dayIndex })
      toast.success('Workout switched')
    } catch {
      toast.error('Failed to switch workout')
    }
  }

  const completedCount = Object.keys(exercises).length
  const totalCount = todayPlan?.exercises?.length ?? 0
  const allDone = completedCount === totalCount && totalCount > 0

  const switchWorkoutSection = !!planDays.length && (
    <div className="mx-4 mb-3 bg-white rounded-2xl border border-black/6 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-[13px] font-semibold text-gray-900">Switch workout</div>
          <div className="text-[11px] text-gray-400">Pick a plan day manually</div>
        </div>
        <div className="text-[11px] text-gray-400">
          Day {currentPlanDayIndex + 1} of {planDays.length}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {planDays.map((day: any, index: number) => {
          const active = index === currentPlanDayIndex
          return (
            <button
              key={day._id ?? `${day.dayName}-${index}`}
              onClick={() => handleSwitchWorkout(index)}
              disabled={setWorkoutDay.isPending}
              className={cn(
                'rounded-xl border px-3 py-2 text-left transition-colors disabled:opacity-50',
                active
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300'
              )}
            >
              <div className="text-[13px] font-semibold capitalize">{day.dayName}</div>
              <div className={cn('text-[11px] capitalize', active ? 'text-gray-200' : 'text-gray-400')}>
                {day.dayType}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  if (planLoading) {
    return (
      <MobileShell>
        <PageHeader title="Workout" />
        <div className="mx-4 space-y-3 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </MobileShell>
    )
  }

  // rest day
  if (isRest) {
    return (
      <MobileShell>
        <PageHeader title="Workout" />
        {switchWorkoutSection}
        <div className="mx-4 mt-6 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-[36px]">😴</span>
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900">Rest day</h2>
            <p className="text-[14px] text-gray-400 mt-1">
              Recovery is where the muscle actually grows.
            </p>
            <p className="text-[13px] text-gray-300 mt-1">
              Stretch, walk, eat your protein.
            </p>
          </div>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      {/* header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">
              {todayPlan?.dayName ?? 'Workout'} day
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {todayPlan?.muscleGroups?.join(' · ')}
            </p>
          </div>
          {started && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetWorkout}
                disabled={deleteLog.isPending}
                className="flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-[12px] font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50"
              >
                <RotateCcw size={12} />
                Reset
              </button>
              <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-full">
                <Timer size={12} />
                <span className="text-[12px] font-semibold font-mono">
                  {existingLog
                    ? `${existingLog.durationMinutes}m`
                    : formatTime(elapsed)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* progress bar */}
        {started && totalCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>{completedCount}/{totalCount} exercises logged</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1D9E75] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* coach tip */}
      {started && (
        <div className="mx-4 mb-3 bg-[#E6F1FB] rounded-xl px-3 py-2.5 border border-[#85B7EB]">
          <p className="text-[12px] text-[#185FA5]">
            Beat your last session on at least one exercise today. Progressive overload = muscle growth.
          </p>
        </div>
      )}

      {switchWorkoutSection}

      {/* exercises */}
      <div className="mx-4 space-y-3 mb-4">
        {!started ? (
          // pre-workout view
          <>
            <div className="bg-white rounded-2xl border border-black/6 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#EAF3DE] rounded-xl flex items-center justify-center">
                  <Dumbbell size={20} className="text-[#1D9E75]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-gray-900">
                    {totalCount} exercises planned
                  </div>
                  <div className="text-[12px] text-gray-400">
                    {todayPlan?.muscleGroups?.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {todayPlan?.exercises?.map((ex: any) => (
                  <span
                    key={ex.name}
                    className="text-[11px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100"
                  >
                    {ex.name}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartWorkout}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform"
            >
              Start workout
            </button>
          </>
        ) : (
          // active workout
          <>
            {todayPlan?.exercises?.map((ex: any) => (
              <ExerciseCard
                key={ex.name}
                exercise={ex}
                savedSets={exercises[ex.name]}
                onSave={handleSaveExercise}
              />
            ))}

            <button
              onClick={handleFinishWorkout}
              disabled={createLog.isPending || updateLog.isPending}
              className={cn(
                'w-full py-4 rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2',
                allDone
                  ? 'bg-[#1D9E75] text-white'
                  : 'bg-gray-900 text-white'
              )}
            >
              {allDone && <CheckCircle2 size={18} />}
              {createLog.isPending || updateLog.isPending
                ? 'Saving...'
                : allDone
                  ? 'Finish workout'
                  : `Finish workout · ${completedCount}/${totalCount} done`}
            </button>
          </>
        )}
      </div>
    </MobileShell>
  )
}