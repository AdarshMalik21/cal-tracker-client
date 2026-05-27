import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Supplement } from '@/types'

export function useRecovery(date: string) {
  return useQuery<{
    sleep:    { _id: string; hoursSlept: number; quality: number } | null
    water:    { glasses: number; goal: number; logId: string | null }
    soreness: { _id: string; muscles: { name: string; level: number }[] } | null
  }>({
    queryKey: ['recovery', date],
    queryFn:  async () => {
      const res = await api.get(`/recovery?date=${date}`)
      return res.data.data
    },
    staleTime: 1000 * 30,
  })
}

export function useLogSleep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { hoursSlept: number; quality: number; date: string }) =>
      api.post('/recovery/sleep', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recovery', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}

export function useLogWater() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { glasses: number; date: string }) =>
      api.post('/recovery/water', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recovery', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}

export function useLogSoreness() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      muscles: { name: string; level: number }[]
      date: string
    }) => api.post('/recovery/soreness', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recovery', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}

export function useSupplements() {
  return useQuery<Supplement[]>({
    queryKey: ['supplements'],
    queryFn:  async () => {
      const res = await api.get('/supplements')
      return res.data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useSupplementLog(date: string) {
  return useQuery<{
    supplement: Supplement
    logId: string | null
    taken: boolean
  }[]>({
    queryKey: ['supplement-log', date],
    queryFn:  async () => {
      const res = await api.get(`/supplements/log?date=${date}`)
      return res.data.data
    },
    staleTime: 1000 * 30,
  })
}

export function useLogSupplement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { supplementId: string; date: string; taken: boolean }) =>
      api.post('/supplements/log', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplement-log', variables.date] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', variables.date] })
    },
  })
}