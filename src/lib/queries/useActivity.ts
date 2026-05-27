import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Activity, ActivityLogEntry } from '@/types'

export function useActivities(category?: string) {
  return useQuery<Activity[]>({
    queryKey: ['activities', category],
    queryFn:  async () => {
      const params = category ? `?category=${category}` : ''
      const res    = await api.get(`/activities${params}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useActivityLog(date: string) {
  return useQuery<{
    totalBurned: number
    totalMinutes: number
    data: ActivityLogEntry[]
  }>({
    queryKey: ['activity-log', date],
    queryFn:  async () => {
      const res = await api.get(`/activity-log?date=${date}`)
      return res.data
    },
    staleTime: 1000 * 30,
  })
}

export function useAddActivityLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      activityId: string
      durationMinutes: number
      date: string
    }) => api.post('/activity-log', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activity-log', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}

export function useDeleteActivityLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { id: string; date: string }) =>
      api.delete(`/activity-log/${payload.id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activity-log', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}