'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Dumbbell,
  UtensilsCrossed,
  Flame,
  Heart,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/today',    icon: Home,            label: 'Today'    },
  { href: '/food',     icon: UtensilsCrossed, label: 'Food'     },
  { href: '/workout',  icon: Dumbbell,        label: 'Workout'  },
  { href: '/activity', icon: Flame,           label: 'Activity' },
  { href: '/recovery', icon: Heart,           label: 'Recovery' },
  { href: '/progress', icon: TrendingUp,      label: 'Progress' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-black/[0.06] bottom-nav-safe z-50">
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[48px]',
                active ? 'text-[#1D9E75]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                className="transition-all"
              />
              <span className={cn('text-[10px] font-medium', active ? 'text-[#1D9E75]' : 'text-gray-400')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}