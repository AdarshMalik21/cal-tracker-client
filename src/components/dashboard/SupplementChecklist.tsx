'use client'

import { Check, Pill } from 'lucide-react'
import { SupplementStatus } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  supplements: SupplementStatus[]
  onToggle?: (index: number, taken: boolean) => void
}

export default function SupplementChecklist({ supplements, onToggle }: Props) {
  if (!supplements || supplements.length === 0) return null

  const done = supplements.filter(s => s.taken).length
  const total = supplements.length

  return (
    <div className="bg-white rounded-2xl border border-black/6 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill size={15} className="text-purple-500" />
          <span className="text-[13px] font-semibold text-gray-800">Supplements</span>
        </div>
        <span className="text-[12px] text-gray-400">{done}/{total} done</span>
      </div>
      <div className="space-y-2">
        {supplements.map((s, i) => (
          <div key={s.supplementId ?? i} className="flex items-center justify-between">
            <div>
              <div className="text-[13px] text-gray-800">{s.name}</div>
              <div className="text-[11px] text-gray-400">{s.dose} · {s.timing}</div>
            </div>
            <button
              onClick={() => onToggle?.(i, !s.taken)}
              aria-label={s.taken ? 'Mark undone' : 'Mark done'}
              className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all',
                s.taken
                  ? 'bg-[#EAF3DE] border-[#97C459]'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              )}
            >
              {s.taken && <Check size={13} className="text-[#3B6D11]" strokeWidth={2.5} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}