'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface DayData {
  date:         string
  kcal:         number
  burned:       number
  net:          number
}

interface Props {
  data:       DayData[]
  calorieGoal: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 shadow-sm min-w-[120px]">
      <p className="text-[11px] text-gray-400 mb-1">{d.dateLabel}</p>
      <p className="text-[14px] font-bold text-gray-900">{d.net} net</p>
      <p className="text-[11px] text-gray-400">{d.kcal} eaten · {d.burned} burned</p>
    </div>
  )
}

export default function WeeklyChart({ data, calorieGoal }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-[13px] text-gray-300">No data for this week</p>
      </div>
    )
  }

  const chartData = data.map(d => ({
    ...d,
    dateLabel: format(parseISO(d.date), 'EEE'),
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <ReferenceLine
          y={calorieGoal}
          stroke="#1D9E75"
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <Bar dataKey="net" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.net >= calorieGoal * 0.9 ? '#1D9E75' : '#378ADD'}
              fillOpacity={entry.net === 0 ? 0.3 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}