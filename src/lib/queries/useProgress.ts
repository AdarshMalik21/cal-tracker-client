import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { WeightLogEntry, Measurement, WeeklyReview } from '@/types'

export function useWeightLogs(limit = 30) {
  return useQuery<WeightLogEntry[]>({
    queryKey: ['weight-logs', limit],
    queryFn:  async () => {
      const res = await api.get(`/weight?limit=${limit}`)
      return res.data.data
    },
    staleTime: 1000 * 60,
  })
}

export function useWeightStats() {
  return useQuery<{
    current:   number
    goal:      number
    remaining: number
    totalGain: number
    avgLast7:  number
    logs:      WeightLogEntry[]
  }>({
    queryKey: ['weight-stats'],
    queryFn:  async () => {
      const res = await api.get('/weight/stats')
      return res.data.data
    },
    staleTime: 1000 * 60,
  })
}

export function useAddWeightLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { weightKg: number; date: string; notes?: string }) =>
      api.post('/weight', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-logs'] })
      queryClient.invalidateQueries({ queryKey: ['weight-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useMeasurements(limit = 12) {
  return useQuery<Measurement[]>({
    queryKey: ['measurements', limit],
    queryFn:  async () => {
      const res = await api.get(`/measurements?limit=${limit}`)
      return res.data.data
    },
    staleTime: 1000 * 60,
  })
}

export function useLatestMeasurement() {
  return useQuery<{
    latest:   Measurement | null
    previous: Measurement | null
    diff:     Record<string, number> | null
  }>({
    queryKey: ['measurement-latest'],
    queryFn:  async () => {
      const res = await api.get('/measurements/latest')
      return res.data.data
    },
    staleTime: 1000 * 60,
  })
}

export function useAddMeasurement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Measurement> & { date: string }) =>
      api.post('/measurements', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] })
      queryClient.invalidateQueries({ queryKey: ['measurement-latest'] })
    },
  })
}

export function useFoodLogRange(start: string, end: string) {
  return useQuery<Record<string, { kcal: number; protein: number; carbs: number; fat: number }>>({
    queryKey: ['food-log-range', start, end],
    queryFn:  async () => {
      const res = await api.get(`/food-log/range?start=${start}&end=${end}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useActivityLogRange(start: string, end: string) {
  return useQuery<Record<string, { caloriesBurned: number; totalMinutes: number }>>({
    queryKey: ['activity-log-range', start, end],
    queryFn:  async () => {
      const res = await api.get(`/activity-log/range?start=${start}&end=${end}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useWeeklyReviews(limit = 10) {
  return useQuery<WeeklyReview[]>({
    queryKey: ['weekly-reviews', limit],
    queryFn:  async () => {
      const res = await api.get(`/weekly-review/history?limit=${limit}`)
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useLatestWeeklyReview() {
  return useQuery<WeeklyReview | null>({
    queryKey: ['weekly-review-latest'],
    queryFn:  async () => {
      const res = await api.get('/weekly-review/latest')
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useSubmitWeeklyReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      energyLevel: string
      gymSessions: number
      weightKg: number
      notes?: string
    }) => api.post('/weekly-review', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-review-latest'] })
      queryClient.invalidateQueries({ queryKey: ['weight-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}