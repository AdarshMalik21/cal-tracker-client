'use client'

import { useDashboard } from '@/lib/queries/useDashboard'
import { useDateStore } from '@/lib/store/useDateStore'
import MobileShell from '@/components/layout/MobileShell'
import PageHeader from '@/components/layout/PageHeader'
import NetCalorieBanner from '@/components/dashboard/NetCalorieBanner'
import MacroRings from '@/components/dashboard/MacroRings'
import CoachInsightCard from '@/components/dashboard/CoachInsightCard'
import TodayWorkoutCard from '@/components/dashboard/TodayWorkoutCard'
import SupplementChecklist from '@/components/dashboard/SupplementChecklist'
import WaterTracker from '@/components/dashboard/WaterTracker'
import WeekStreak from '@/components/dashboard/WeekStreak'
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton'
import { Bot } from 'lucide-react'
import api from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useLogSupplement } from '@/lib/queries/useRecovery'

export default function TodayPage() {
  const { selectedDate } = useDateStore()
  const { data, isLoading, error } = useDashboard(selectedDate)
  const queryClient = useQueryClient()
  const logSupplement = useLogSupplement()

  const handleWaterUpdate = async (glasses: number) => {
    try {
      await api.post('/recovery/water', { glasses, date: selectedDate })
      queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDate] })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSupplementToggle = async (index: number, taken: boolean) => {
    const supplement = data?.today.supplements[index]
    if (!supplement?.supplementId) return
    try {
      await logSupplement.mutateAsync({
        supplementId: supplement.supplementId,
        date: selectedDate,
        taken,
      })
      queryClient.invalidateQueries({ queryKey: ['dashboard', selectedDate] })
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <MobileShell>
        <PageHeader showDateNav />
        <DashboardSkeleton />
      </MobileShell>
    )
  }

  if (error || !data) {
    return (
      <MobileShell>
        <PageHeader showDateNav />
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-gray-400 text-[14px]">Could not load dashboard</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['dashboard'] })}
            className="text-[13px] text-[#1D9E75] font-medium"
          >
            Retry
          </button>
        </div>
      </MobileShell>
    )
  }

  const { today, weeklyStats, profile } = data

  return (
    <MobileShell>
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <PageHeader showDateNav />
          </div>
          <p className="text-[12px] text-gray-400 px-4 -mt-1">
            {profile.name} · Lean bulk · {profile.currentWeightKg}kg → {profile.goalWeightKg}kg
          </p>
        </div>
        <div className="px-4">
          <span className="text-[11px] font-semibold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full border border-purple-100">
            {today.todaysPlan?.dayType === 'rest'
              ? 'Rest day'
              : `${today.todaysPlan?.dayName ?? ''} day`}
          </span>
        </div>
      </div>

      {/* coach insight */}
      <CoachInsightCard insights={today.coachInsights} />

      {/* net calorie banner */}
      <NetCalorieBanner today={today} />

      {/* macros */}
      <MacroRings macros={today.macros} goals={today.macroGoals} />

      {/* today's workout */}
      <div className="mx-4 mt-3">
        <TodayWorkoutCard
          todaysPlan={today.todaysPlan}
          workoutDone={today.workoutDone}
        />
      </div>

      {/* water + supplements side by side */}
      <div className="mx-4 mt-3 grid grid-cols-1 gap-3">
        <WaterTracker
          glasses={today.water.glasses}
          goal={today.water.goal}
          onUpdate={handleWaterUpdate}
        />
        <SupplementChecklist
          supplements={today.supplements}
          onToggle={handleSupplementToggle}
        />
      </div>

      {/* week streak */}
      <div className="mx-4 mt-3">
        <WeekStreak
          streak={weeklyStats.streak}
          gymSessions={weeklyStats.gymSessions}
          targetSessions={weeklyStats.targetSessions}
        />
      </div>

      {/* weekly stats */}
      <div className="mx-4 mt-3 mb-4 grid grid-cols-2 gap-2">
        {[
          { label: 'Avg net kcal', value: weeklyStats.avgNetKcal.toLocaleString() },
          { label: 'Avg protein', value: `${weeklyStats.avgProtein}g` },
          { label: 'Avg burned', value: `${weeklyStats.avgBurned} kcal` },
          { label: 'Gym sessions', value: `${weeklyStats.gymSessions}/${weeklyStats.targetSessions}` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-black/6 p-3 shadow-sm"
          >
            <div className="text-[11px] text-gray-400 mb-1">{label}</div>
            <div className="text-[18px] font-bold text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </MobileShell>
  )
}