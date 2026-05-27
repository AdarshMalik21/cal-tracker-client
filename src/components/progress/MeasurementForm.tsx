'use client'

import { useState }    from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { getTodayString } from '@/lib/utils'
import { Measurement } from '@/types'

interface Props {
  open:     boolean
  onClose:  () => void
  onSave:   (data: Partial<Measurement> & { date: string }) => void
  initial?: Measurement | null
}

const FIELDS = [
  { key: 'weightKg',      label: 'Weight',         unit: 'kg'  },
  { key: 'chest',         label: 'Chest',          unit: 'cm'  },
  { key: 'waist',         label: 'Waist',          unit: 'cm'  },
  { key: 'hips',          label: 'Hips',           unit: 'cm'  },
  { key: 'bicepR',        label: 'Bicep (Right)',  unit: 'cm'  },
  { key: 'bicepL',        label: 'Bicep (Left)',   unit: 'cm'  },
  { key: 'thighR',        label: 'Thigh (Right)',  unit: 'cm'  },
  { key: 'thighL',        label: 'Thigh (Left)',   unit: 'cm'  },
  { key: 'shoulderWidth', label: 'Shoulder width', unit: 'cm'  },
]

export default function MeasurementForm({ open, onClose, onSave, initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    FIELDS.forEach(f => {
      init[f.key] = initial?.[f.key as keyof Measurement]?.toString() ?? ''
    })
    return init
  })
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSave = () => {
    const payload: Record<string, any> = { date: getTodayString(), notes }
    FIELDS.forEach(f => {
      if (values[f.key] !== '') {
        payload[f.key] = parseFloat(values[f.key])
      }
    })
    onSave(payload as Partial<Measurement> & { date: string })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[90dvh] px-5 pb-8 flex flex-col">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-4 flex-shrink-0" />
        <h3 className="text-[17px] font-semibold text-gray-900 mb-1 flex-shrink-0">
          Log measurements
        </h3>
        <p className="text-[12px] text-gray-400 mb-4 flex-shrink-0">
          Leave blank to skip. Recommended monthly.
        </p>

        <div className="flex-1 overflow-y-auto space-y-3">
          {FIELDS.map(({ key, label, unit }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <label className="text-[14px] text-gray-700 flex-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={values[key]}
                  onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="—"
                  step="0.1"
                  className="w-20 text-center px-2 py-2 border border-gray-200 rounded-xl text-[14px] font-semibold bg-gray-50 outline-none focus:border-gray-400"
                />
                <span className="text-[12px] text-gray-400 w-6">{unit}</span>
              </div>
            </div>
          ))}

          <div>
            <label className="text-[14px] text-gray-700 block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] bg-gray-50 outline-none focus:border-gray-400 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[15px] font-semibold active:scale-[0.98] transition-transform mt-4 flex-shrink-0"
        >
          Save measurements
        </button>
      </SheetContent>
    </Sheet>
  )
}