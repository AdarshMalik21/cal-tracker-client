'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { WeightLogEntry } from '@/types'
import { format }         from 'date-fns'

interface Props {
  logs:       WeightLogEntry[]
  goalWeight: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 shadow-sm">
      <p className="text-[12px] text-gray-400">{payload[0].payload.dateLabel}</p>
      <p className="text-[16px] font-bold text-gray-900">{payload[0].value} kg</p>
    </div>
  )
}

export default function WeightChart({ logs, goalWeight }: Props) {
  if (!logs || logs.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-[13px] text-gray-300">No weight data yet</p>
      </div>
    )
  }

  const data = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(l => ({
      date:      l.date,
      dateLabel: format(new Date(l.date + 'T00:00:00'), 'dd MMM'),
      weight:    l.weightKg,
    }))

  const minWeight = Math.min(...data.map(d => d.weight)) - 1
  const maxWeight = Math.max(goalWeight, ...data.map(d => d.weight)) + 1

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minWeight, maxWeight]}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={goalWeight}
          stroke="#1D9E75"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          label={{ value: `Goal ${goalWeight}kg`, position: 'right', fontSize: 10, fill: '#1D9E75' }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#378ADD"
          strokeWidth={2.5}
          dot={{ fill: '#378ADD', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#378ADD' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}