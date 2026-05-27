'use client'

import { Bot } from 'lucide-react'

interface Props {
  insights: string[]
}

export default function CoachInsightCard({ insights }: Props) {
  if (!insights || insights.length === 0) return null

  return (
    <div className="mx-4 mt-3 bg-[#EAF3DE] rounded-2xl border border-[#C0DD97] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Bot size={15} className="text-[#3B6D11]" />
        <span className="text-[12px] font-semibold text-[#3B6D11] uppercase tracking-wide">
          Coach says
        </span>
      </div>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <p key={i} className="text-[13px] text-[#0F6E56] leading-relaxed">
            {i > 0 && <span className="text-[#0F6E56]/50 mr-1">·</span>}
            {insight}
          </p>
        ))}
      </div>
    </div>
  )
}