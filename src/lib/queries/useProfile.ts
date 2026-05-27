import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Profile } from '@/types'

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn:  async () => {
      const res = await api.get('/profile')
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Profile>) => api.put('/profile', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRecalculateTargets() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/profile/recalculate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}