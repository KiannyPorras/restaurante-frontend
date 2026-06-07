import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLocks, createLock, deleteLock } from '../services/lockService'
import type { TableLockCreate } from '../models/lockModels'

export function useLocksQuery(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['locks', page, pageSize],
    queryFn: () => getLocks(page, pageSize),
  })
}

export function useCreateLockMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lock: TableLockCreate) => createLock(lock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locks'] })
    },
  })
}

export function useDeleteLockMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteLock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locks'] })
    },
  })
}
