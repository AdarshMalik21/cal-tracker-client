'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Minus, Plus, Flame } from 'lucide-react'
import { useActivities } from '@/lib/queries/useActivity'
import { Activity } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_TABS = [
    { key: 'all', label: 'All' },
    { key: 'gym', label: 'Gym' },
    { key: 'cardio', label: 'Cardio' },
    { key: 'daily', label: 'Daily' },
    { key: 'sports', label: 'Sports' },
]

interface Props {
    open: boolean
    onClose: () => void
    onAdd: (activity: Activity, durationMinutes: number) => void
    weightKg?: number
}

export default function ActivitySheet({ open, onClose, onAdd, weightKg = 70 }: Props) {
    const [category, setCategory] = useState('all')
    const [selected, setSelected] = useState<Activity | null>(null)
    const [duration, setDuration] = useState(60)

    const { data: activities = [] } = useActivities(
        category === 'all' ? undefined : category
    )

    const caloriesBurned = selected
        ? Math.round(selected.MET * weightKg * (duration / 60))
        : 0

    const changeDuration = (delta: number) => {
        setDuration(prev => Math.max(5, prev + delta))
    }

    if (selected) {
        return (
            <Sheet open={open} onOpenChange={() => { setSelected(null); onClose() }}>
                <SheetContent side="bottom" className="rounded-t-3xl h-[85dvh]! w-full px-5 pb-8 flex flex-col min-h-0 overflow-hidden touch-pan-y">
                    <SheetTitle className="sr-only">Log activity</SheetTitle>
                    <SheetDescription className="sr-only">
                        Pick an activity, adjust the duration, and log the calories burned.
                    </SheetDescription>
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-4 shrink-0" />

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <button
                            onClick={() => setSelected(null)}
                            className="text-[13px] text-gray-400 mb-4 flex items-center gap-1"
                        >
                            ← Back
                        </button>

                        <div className="mb-5">
                            <h3 className="text-[17px] font-semibold text-gray-900">{selected.name}</h3>
                            <p className="text-[12px] text-gray-400 mt-0.5 capitalize">
                                {selected.category} · MET {selected.MET}
                            </p>
                        </div>

                        <div className="mb-5">
                            <p className="text-[12px] text-gray-400 mb-3">Duration (minutes)</p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => changeDuration(-5)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center active:scale-95 transition-all"
                                >
                                    <Minus size={16} className="text-gray-600" />
                                </button>
                                <span className="text-[28px] font-bold text-gray-900 min-w-15 text-center">
                                    {duration}
                                </span>
                                <button
                                    onClick={() => changeDuration(5)}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center active:scale-95 transition-all"
                                >
                                    <Plus size={16} className="text-gray-600" />
                                </button>
                                <span className="text-[13px] text-gray-400">min</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center py-4 border-t border-b border-black/6 mb-5">
                            <div className="flex items-center gap-2">
                                <Flame size={20} className="text-[#E05C2A]" />
                                <span className="text-[32px] font-bold text-[#E05C2A]">{caloriesBurned}</span>
                                <span className="text-[15px] text-gray-400">kcal</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">
                                MET {selected.MET} × {weightKg}kg × {duration} min
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onAdd(selected, duration)
                            setSelected(null)
                            setDuration(60)
                            onClose()
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform shrink-0"
                    >
                        Log activity
                    </button>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom" className="rounded-t-3xl h-[85dvh]! w-full px-0 pb-0 flex flex-col min-h-0 overflow-hidden touch-pan-y">
                <SheetTitle className="sr-only">Log activity</SheetTitle>
                <SheetDescription className="sr-only">
                    Browse activities, filter by category, and choose one to log.
                </SheetDescription>
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-0 shrink-0" />

                <div className="px-5 pt-3 pb-2 shrink-0">
                    <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Log activity</h3>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {CATEGORY_TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setCategory(t.key)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors',
                                    category === t.key
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 divide-y divide-black/4">
                    {activities.map(activity => (
                        <button
                            key={activity._id}
                            onClick={() => setSelected(activity)}
                            className="w-full flex items-center justify-between py-3.5 text-left active:bg-gray-50 transition-colors"
                        >
                            <div>
                                <div className="text-[14px] text-gray-900">{activity.name}</div>
                                <div className="text-[12px] text-gray-400 mt-0.5 capitalize">
                                    {activity.category} · MET {activity.MET}
                                </div>
                            </div>
                            <div className="text-right ml-3">
                                <div className="text-[13px] font-semibold text-[#E05C2A]">
                                    {Math.round(activity.MET * weightKg)} kcal/hr
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}