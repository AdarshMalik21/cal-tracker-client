'use client'

import { useState }           from 'react'
import { toast }              from 'sonner'
import MobileShell            from '@/components/layout/MobileShell'
import PageHeader             from '@/components/layout/PageHeader'
import SleepLogger            from '@/components/recovery/SleepLogger'
import WaterDots              from '@/components/recovery/WaterDots'
import SorenessRater          from '@/components/recovery/SorenessRater'
import { useDateStore }       from '@/lib/store/useDateStore'
import {
  useRecovery,
  useLogSleep,
  useLogWater,
  useLogSoreness,
  useSupplementLog,
  useLogSupplement,
} from '@/lib/queries/useRecovery'
import { Skeleton }           from '@/components/ui/skeleton'
import { Check, Pill, Save }  from 'lucide-react'
import { cn }                 from '@/lib/utils'

export default function RecoveryPage() {
  const { selectedDate } = useDateStore()

  const { data, isLoading }  = useRecovery(selectedDate)
  const { data: suppLog = [] } = useSupplementLog(selectedDate)

  const logSleep     = useLogSleep()
  const logWater     = useLogWater()
  const logSoreness  = useLogSoreness()
  const logSupp      = useLogSupplement()

  const [pendingSleep, setPendingSleep] = useState<{ hours: number; quality: number } | null>(null)
  const [pendingSoreness, setPendingSoreness] = useState<{ name: string; level: number }[] | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSleepChange = (hours: number, quality: number) => {
    setPendingSleep({ hours, quality })
  }

  const handleWaterChange = async (glasses: number) => {
    try {
      await logWater.mutateAsync({ glasses, date: selectedDate })
      toast.success(`Water updated: ${glasses} glasses`)
    } catch {
      toast.error('Failed to update water')
    }
  }

  const handleSorenessChange = (muscles: { name: string; level: number }[]) => {
    setPendingSoreness(muscles)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const promises = []

      if (pendingSleep) {
        promises.push(
          logSleep.mutateAsync({
            hoursSlept: pendingSleep.hours,
            quality:    pendingSleep.quality,
            date:       selectedDate,
          })
        )
      }

      if (pendingSoreness && pendingSoreness.length > 0) {
        promises.push(
          logSoreness.mutateAsync({
            muscles: pendingSoreness,
            date:    selectedDate,
          })
        )
      }

      await Promise.all(promises)
      toast.success('Recovery logged')
    } catch {
      toast.error('Failed to save recovery data')
    } finally {
      setSaving(false)
    }
  }

  const handleSupplementToggle = async (supplementId: string, taken: boolean) => {
    try {
      await logSupp.mutateAsync({ supplementId, date: selectedDate, taken })
      toast.success(taken ? 'Supplement marked done' : 'Supplement unmarked')
    } catch {
      toast.error('Failed to update supplement')
    }
  }

  const hasPending = !!pendingSleep || !!pendingSoreness

  if (isLoading) {
    return (
      <MobileShell>
        <PageHeader title="Recovery" />
        <div className="mx-4 space-y-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <PageHeader
        title="Recovery"
        showDateNav
        subtitle="Sleep · Water · Soreness · Supplements"
        right={
          hasPending ? (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-1.5 bg-[#1D9E75] text-white px-3 py-1.5 rounded-full"
            >
              <Save size={13} />
              <span className="text-[12px] font-semibold">
                {saving ? 'Saving...' : 'Save'}
              </span>
            </button>
          ) : null
        }
      />

      <div className="mx-4 space-y-3 mb-4">

        {/* sleep */}
        <SleepLogger
          hoursSlept={data?.sleep?.hoursSlept ?? 7.5}
          quality={data?.sleep?.quality ?? 3}
          onChange={handleSleepChange}
        />

        {/* water */}
        <WaterDots
          glasses={data?.water?.glasses ?? 0}
          goal={data?.water?.goal ?? 10}
          onChange={handleWaterChange}
        />

        {/* soreness */}
        <SorenessRater
          initial={data?.soreness?.muscles ?? []}
          onChange={handleSorenessChange}
        />

        {/* supplements */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill size={15} className="text-purple-500" />
              <span className="text-[13px] font-semibold text-gray-800">Supplements</span>
            </div>
            <span className="text-[12px] text-gray-400">
              {suppLog.filter(s => s.taken).length}/{suppLog.length} done
            </span>
          </div>

          {suppLog.length === 0 ? (
            <p className="text-[13px] text-gray-400">No supplements configured</p>
          ) : (
            <div className="space-y-3">
              {suppLog.map(({ supplement, logId, taken }) => (
                <div key={supplement._id} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] text-gray-800">{supplement.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {supplement.dose} · {supplement.timing}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSupplementToggle(supplement._id, !taken)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                      taken
                        ? 'bg-[#EAF3DE] border-[#97C459]'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {taken && (
                      <Check size={14} className="text-[#3B6D11]" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MobileShell>
  )
}