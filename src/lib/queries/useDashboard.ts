import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { DashboardData } from '@/types'

export function useDashboard(date: string) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', date],
    queryFn:  async () => {
      const res = await api.get(`/dashboard?date=${date}`)
      return res.data.data ?? res.data
    },
    staleTime: 1000 * 60,   // 1 min
  })
}