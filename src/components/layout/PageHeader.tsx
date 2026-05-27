'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDateStore } from '@/lib/store/useDateStore'
import { formatDisplayDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title?: string
  showDateNav?: boolean
  subtitle?: string
  right?: React.ReactNode
}

export default function PageHeader({
  title,
  showDateNav = false,
  subtitle,
  right,
}: PageHeaderProps) {
  const { selectedDate, goToPrevDay, goToNextDay, isToday } = useDateStore()

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex-1">
        {showDateNav ? (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevDay}
              className="p-1.5 rounded-xl hover:bg-black/5 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <span className="text-[15px] font-semibold text-gray-900">
              {formatDisplayDate(selectedDate)}
            </span>
            <button
              onClick={goToNextDay}
              disabled={isToday()}
              className={cn(
                'p-1.5 rounded-xl transition-colors',
                isToday()
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-black/5'
              )}
              aria-label="Next day"
            >
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
      </div>
      {right && <div className="ml-2">{right}</div>}
    </div>
  )
}