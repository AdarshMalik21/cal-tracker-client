'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format, subDays } from 'date-fns'
import MobileShell from '@/components/layout/MobileShell'
import PageHeader from '@/components/layout/PageHeader'
import WeightChart from '@/components/progress/WeightChart'
import WeeklyChart from '@/components/progress/WeeklyChart'
import MeasurementForm from '@/components/progress/MeasurementForm'
import { useDashboard } from '@/lib/queries/useDashboard'
import {
  useWeightStats,
  useAddWeightLog,
  useLatestMeasurement,
  useAddMeasurement,
  useFoodLogRange,
  useActivityLogRange,
  useLatestWeeklyReview,
  useSubmitWeeklyReview,
} from '@/lib/queries/useProgress'
import { getTodayString } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  Scale,
  Ruler,
  Bot,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Measurement } from '@/types'

const ENERGY_OPTIONS = ['low', 'ok', 'good', 'high'] as const
const SESSION_OPTIONS = [1, 2, 3, 4, 5, 6]

export default function ProgressPage() {
  const today = getTodayString()
  const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd')

  const { data: dashboard } = useDashboard(today)
  const { data: weightStats, isLoading: statsLoading } = useWeightStats()
  const { data: latestMeasurement } = useLatestMeasurement()
  const { data: foodRange = {} } = useFoodLogRange(weekStart, today)
  const { data: actRange = {} } = useActivityLogRange(weekStart, today)
  const { data: latestReview } = useLatestWeeklyReview()

  const addWeight = useAddWeightLog()
  const addMeasurement = useAddMeasurement()
  const submitReview = useSubmitWeeklyReview()

  const [weightInput, setWeightInput] = useState('')
  const [measOpen, setMeasOpen] = useState(false)
  const [reviewEnergy, setReviewEnergy] = useState<typeof ENERGY_OPTIONS[number]>('good')
  const [reviewSessions, setReviewSessions] = useState(4)
  const [reviewWeight, setReviewWeight] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const profile = dashboard?.profile
  const calorieGoal = profile?.calorieGoal ?? 3000

  // build weekly chart data
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  )

  const weekChartData = weekDays.map(date => {
    const food = foodRange[date] ?? { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    const activity = actRange[date] ?? { caloriesBurned: 0 }
    return {
      date,
      kcal: food.kcal,
      burned: activity.caloriesBurned,
      net: Math.max(0, food.kcal - activity.caloriesBurned),
    }
  })

  const handleLogWeight = async () => {
    const w = parseFloat(weightInput)
    if (!w || w < 30 || w > 200) {
      toast.error('Enter a valid weight between 30–200 kg')
      return
    }
    try {
      await addWeight.mutateAsync({ weightKg: w, date: today })
      toast.success(`${w} kg logged`)
      setWeightInput('')
    } catch {
      toast.error('Failed to log weight')
    }
  }

  const handleSaveMeasurement = async (data: any) => {
    try {
      await addMeasurement.mutateAsync(data)
      toast.success('Measurements saved')
    } catch {
      toast.error('Failed to save measurements')
    }
  }

  const handleSubmitReview = async () => {
    const w = parseFloat(reviewWeight)
    if (!w) { toast.error('Enter your current weight'); return }
    setSubmittingReview(true)
    try {
      await submitReview.mutateAsync({
        energyLevel: reviewEnergy,
        gymSessions: reviewSessions,
        weightKg: w,
        notes: reviewNotes,
      })
      toast.success('Weekly review submitted!')
      setReviewWeight('')
      setReviewNotes('')
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const meas = latestMeasurement?.latest
  const diff = latestMeasurement?.diff

  const MEAS_DISPLAY = [
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'bicepR', label: 'Bicep' },
    { key: 'thighR', label: 'Thigh' },
    { key: 'shoulderWidth', label: 'Shoulders' },
  ]

  return (
    <MobileShell>
      <PageHeader title="Progress" subtitle="Your lean bulk journey" />

      <div className="mx-4 space-y-3 mb-4">

        {/* weight stats */}
        {statsLoading ? (
          <Skeleton className="h-32 w-full rounded-2xl" />
        ) : weightStats ? (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Scale size={15} className="text-[#378ADD]" />
              <span className="text-[13px] font-semibold text-gray-800">Weight progress</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-[22px] font-bold text-gray-900">{weightStats.current}</div>
                <div className="text-[11px] text-gray-400">current kg</div>
              </div>
              <div className="text-center">
                <div className="text-[22px] font-bold text-[#1D9E75]">{weightStats.goal}</div>
                <div className="text-[11px] text-gray-400">goal kg</div>
              </div>
              <div className="text-center">
                <div className="text-[22px] font-bold text-[#378ADD]">{weightStats.remaining}</div>
                <div className="text-[11px] text-gray-400">kg to go</div>
              </div>
            </div>

            {/* progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Start: ~65 kg</span>
                <span>
                  {Math.round(
                    ((weightStats.current - 65) / (weightStats.goal - 65)) * 100
                  )}% to goal
                </span>
                <span>Goal: {weightStats.goal} kg</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1D9E75] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      Math.round(((weightStats.current - 65) / (weightStats.goal - 65)) * 100),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <WeightChart
              logs={weightStats.logs}
              goalWeight={weightStats.goal}
            />
          </div>
        ) : null}

        {/* log weight */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="text-[13px] font-semibold text-gray-800 mb-3">
            Log today's weight
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              placeholder="e.g. 70.5"
              step="0.1"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] bg-gray-50 outline-none focus:border-gray-400"
            />
            <span className="self-center text-[13px] text-gray-400">kg</span>
            <button
              onClick={handleLogWeight}
              disabled={addWeight.isPending}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-semibold active:scale-95 transition-all"
            >
              {addWeight.isPending ? '...' : 'Log'}
            </button>
          </div>
        </div>

        {/* weekly calories chart */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-[#1D9E75]" />
              <span className="text-[13px] font-semibold text-gray-800">Net calories — 7 days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
              <span className="text-[10px] text-gray-400">Goal</span>
            </div>
          </div>
          <WeeklyChart data={weekChartData} calorieGoal={calorieGoal} />
        </div>

        {/* body measurements */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ruler size={15} className="text-purple-500" />
              <span className="text-[13px] font-semibold text-gray-800">Body measurements</span>
            </div>
            <button
              onClick={() => setMeasOpen(true)}
              className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600"
            >
              <Plus size={13} />
              Update
            </button>
          </div>

          {meas ? (
            <>
              <div className="text-[11px] text-gray-400 mb-3">
                Last logged: {format(new Date(meas.date + 'T00:00:00'), 'dd MMM yyyy')}
              </div>
              <div className="space-y-2">
                {MEAS_DISPLAY.map(({ key, label }) => {
                  const keyTyped = key as keyof Measurement
                  const val = meas ? (meas[keyTyped] ?? null) : null
                  const delta = diff?.[keyTyped]
                  if (val === null || val === undefined) return null
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[13px] text-gray-500">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-gray-900">
                          {val} cm
                        </span>
                        {delta !== undefined && delta !== 0 && (
                          <span
                            className={cn(
                              'text-[11px] font-medium px-1.5 py-0.5 rounded-full',
                              delta > 0
                                ? 'bg-[#EAF3DE] text-[#3B6D11]'
                                : 'bg-[#FCEBEB] text-[#A32D2D]'
                            )}
                          >
                            {delta > 0 ? '+' : ''}{delta}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-[13px] text-gray-400">No measurements logged yet</p>
              <button
                onClick={() => setMeasOpen(true)}
                className="mt-2 text-[13px] text-[#1D9E75] font-medium"
              >
                Log first measurement
              </button>
            </div>
          )}
        </div>

        {/* weekly coach review */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={15} className="text-[#3B6D11]" />
            <span className="text-[13px] font-semibold text-gray-800">Weekly check-in</span>
          </div>

          {/* last review coach feedback */}
          {latestReview?.coachFeedback && latestReview.coachFeedback.length > 0 && (
            <div className="mb-4 bg-[#EAF3DE] rounded-xl p-3 border border-[#C0DD97]">
              <p className="text-[11px] font-semibold text-[#3B6D11] mb-1 uppercase tracking-wide">
                Last week's feedback
              </p>
              <div className="space-y-1">
                {latestReview.coachFeedback.map((f, i) => (
                  <p key={i} className="text-[12px] text-[#0F6E56] leading-relaxed">{f}</p>
                ))}
              </div>
            </div>
          )}

          {/* energy level */}
          <div className="mb-3">
            <p className="text-[12px] text-gray-500 mb-2">How was your energy this week?</p>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setReviewEnergy(e)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-[12px] font-medium capitalize transition-colors',
                    reviewEnergy === e
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* sessions */}
          <div className="mb-3">
            <p className="text-[12px] text-gray-500 mb-2">Gym sessions this week</p>
            <div className="flex gap-2">
              {SESSION_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setReviewSessions(n)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-[12px] font-semibold transition-colors',
                    reviewSessions === n
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* weight */}
          <div className="mb-3">
            <p className="text-[12px] text-gray-500 mb-2">Current weight (kg)</p>
            <input
              type="number"
              value={reviewWeight}
              onChange={e => setReviewWeight(e.target.value)}
              placeholder="e.g. 70.5"
              step="0.1"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] bg-gray-50 outline-none focus:border-gray-400"
            />
          </div>

          {/* notes */}
          <div className="mb-4">
            <p className="text-[12px] text-gray-500 mb-2">Notes (optional)</p>
            <textarea
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              placeholder="How did this week feel overall?"
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-gray-50 outline-none focus:border-gray-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmitReview}
            disabled={submittingReview}
            className="w-full py-3.5 bg-[#1D9E75] text-white rounded-2xl text-[14px] font-semibold active:scale-[0.98] transition-transform"
          >
            {submittingReview ? 'Submitting...' : 'Submit weekly review'}
          </button>
        </div>

      </div>

      <MeasurementForm
        open={measOpen}
        onClose={() => setMeasOpen(false)}
        onSave={handleSaveMeasurement}
        initial={meas}
      />
    </MobileShell>
  )
}