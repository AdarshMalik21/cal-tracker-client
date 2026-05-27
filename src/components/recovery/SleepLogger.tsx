'use client'

import { useState } from 'react'
import { Moon, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  hoursSlept: number
  quality: number
  onChange: (hours: number, quality: number) => void
}

const QUALITY_LABELS = ['', 'Terrible', 'Bad', 'OK', 'Good', 'Great']
const QUALITY_COLORS = ['', '#E05C2A', '#EF9F27', '#378ADD', '#1D9E75', '#1D9E75']

export default function SleepLogger({ hoursSlept, quality, onChange }: Props) {
  const [hours, setHours]   = useState(hoursSlept || 7.5)
  const [qual, setQual]     = useState(quality    || 3)

  const sleepLabel =
    hours < 6   ? 'Too little — recovery will suffer'  :
    hours < 7.5 ? 'Acceptable'                          :
    hours < 9   ? 'Optimal for muscle growth'           :
                  'Great recovery window'

  const sleepColor =
    hours < 6   ? '#E05C2A' :
    hours < 7.5 ? '#EF9F27' :
                  '#1D9E75'

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Moon size={15} className="text-indigo-500" />
        <span className="text-[13px] font-semibold text-gray-800">Sleep</span>
      </div>

      {/* hours slider */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[13px] text-gray-500">Hours slept</span>
          <span className="text-[22px] font-bold" style={{ color: sleepColor }}>
            {hours.toFixed(1)}h
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="12"
          step="0.5"
          value={hours}
          onChange={e => {
            const v = parseFloat(e.target.value)
            setHours(v)
            onChange(v, qual)
          }}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-gray-300 mt-1">
          <span>3h</span><span>12h</span>
        </div>
        <p className="text-[12px] mt-1" style={{ color: sleepColor }}>{sleepLabel}</p>
      </div>

      {/* quality rating */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-gray-500">Sleep quality</span>
          <span
            className="text-[12px] font-medium"
            style={{ color: QUALITY_COLORS[qual] }}
          >
            {QUALITY_LABELS[qual]}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => { setQual(n); onChange(hours, n) }}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <Star
                size={22}
                className={cn(
                  'transition-all',
                  n <= qual ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                )}
              />
              <span className="text-[9px] text-gray-300">{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}