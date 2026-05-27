import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getTodayString(): string {
  return formatDate(new Date())
}

export function formatDisplayDate(dateStr: string): string {
  const date     = new Date(dateStr + 'T00:00:00')
  const today    = getTodayString()
  const yesterday = formatDate(new Date(Date.now() - 86400000))

  if (dateStr === today)     return 'Today'
  if (dateStr === yesterday) return 'Yesterday'
  return format(date, 'EEE, dd MMM')
}

export function getMacroColor(macro: 'protein' | 'carbs' | 'fat'): string {
  const colors = {
    protein: '#1D9E75',
    carbs:   '#378ADD',
    fat:     '#EF9F27',
  }
  return colors[macro]
}

export function getSurplusLabel(surplus: number): {
  label: string
  color: string
  bg: string
} {
  if (surplus >= -300 && surplus <= 600) {
    return { label: 'On track', color: '#3B6D11', bg: '#EAF3DE' }
  }
  if (surplus < -300) {
    return { label: 'Under target', color: '#854F0B', bg: '#FAEEDA' }
  }
  return { label: 'Over target', color: '#A32D2D', bg: '#FCEBEB' }
}

export function getProgressPercent(current: number, goal: number): number {
  if (goal === 0) return 0
  return Math.min(Math.round((current / goal) * 100), 100)
}