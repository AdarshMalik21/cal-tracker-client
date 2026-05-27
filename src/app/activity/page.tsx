'use client'

import { useState }           from 'react'
import { toast }              from 'sonner'
import MobileShell            from '@/components/layout/MobileShell'
import PageHeader             from '@/components/layout/PageHeader'
import ActivityItem           from '@/components/activity/ActivityItem'
import ActivitySheet          from '@/components/activity/ActivitySheet'
import { useDateStore }       from '@/lib/store/useDateStore'
import {
  useActivityLog,
  useAddActivityLog,
  useDeleteActivityLog,
} from '@/lib/queries/useActivity'
import { useDashboard }       from '@/lib/queries/useDashboard'
import { Activity }           from '@/types'
import { Skeleton }           from '@/components/ui/skeleton'
import { Flame, Clock, Plus, Zap } from 'lucide-react'

export default function ActivityPage() {
  const { selectedDate }          = useDateStore()
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data: logData, isLoading } = useActivityLog(selectedDate)
  const { data: dashboard }          = useDashboard(selectedDate)
  const addActivity                  = useAddActivityLog()
  const deleteActivity               = useDeleteActivityLog()

  const weightKg = dashboard?.profile?.currentWeightKg ?? 70
  const entries  = logData?.data ?? []
  const totalBurned  = logData?.totalBurned  ?? 0
  const totalMinutes = logData?.totalMinutes ?? 0

  const handleAdd = async (activity: Activity, durationMinutes: number) => {
    try {
      await addActivity.mutateAsync({
        activityId: activity._id,
        durationMinutes,
        date: selectedDate,
      })
      toast.success(`${activity.name} logged`)
    } catch {
      toast.error('Failed to log activity')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity.mutateAsync({ id, date: selectedDate })
      toast.success('Activity removed')
    } catch {
      toast.error('Failed to delete activity')
    }
  }

  return (
    <MobileShell>
      <PageHeader
        title="Activity"
        showDateNav
        right={
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-full"
          >
            <Plus size={13} />
            <span className="text-[12px] font-semibold">Log</span>
          </button>
        }
      />

      {/* summary cards */}
      <div className="mx-4 mt-2 grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={15} className="text-[#E05C2A]" />
            <span className="text-[12px] text-gray-400">Burned today</span>
          </div>
          <div className="text-[26px] font-bold text-[#E05C2A]">{totalBurned}</div>
          <div className="text-[11px] text-gray-400">kcal</div>
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={15} className="text-gray-400" />
            <span className="text-[12px] text-gray-400">Active time</span>
          </div>
          <div className="text-[26px] font-bold text-gray-900">{totalMinutes}</div>
          <div className="text-[11px] text-gray-400">minutes</div>
        </div>
      </div>

      {/* net calorie impact */}
      {totalBurned > 0 && (
        <div className="mx-4 mb-3 bg-orange-50 rounded-2xl border border-orange-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#E05C2A]" />
            <p className="text-[13px] text-[#E05C2A] font-medium">
              You burned {totalBurned} kcal — make sure to eat enough to stay in surplus
            </p>
          </div>
        </div>
      )}

      {/* logged activities */}
      <div className="mx-4 mb-3">
        <div className="text-[12px] font-medium text-gray-400 uppercase tracking-wide mb-2">
          Today's activities
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 text-center shadow-sm">
            <Flame size={28} className="text-gray-200 mx-auto mb-2" />
            <p className="text-[14px] text-gray-400">No activities logged yet</p>
            <p className="text-[12px] text-gray-300 mt-1">Tap Log to add gym, cardio or daily activities</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] px-4 shadow-sm">
            {entries.map(entry => (
              <ActivityItem
                key={entry._id}
                entry={entry}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* MET reference */}
      <div className="mx-4 mb-4">
        <div className="text-[12px] font-medium text-gray-400 uppercase tracking-wide mb-2">
          How calories are calculated
        </div>
        <div className="bg-white rounded-2xl border border-black/[0.06] px-4 py-3 shadow-sm">
          <p className="text-[13px] text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">MET × {weightKg}kg × hours</span>
            {' '}— MET (Metabolic Equivalent) measures exercise intensity.
            Weight training = MET 6.0, Running = MET 10.0, Walking = MET 3.5.
          </p>
        </div>
      </div>

      <ActivitySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={handleAdd}
        weightKg={weightKg}
      />
    </MobileShell>
  )
}