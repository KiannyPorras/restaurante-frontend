import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createWaitingList,
  getPendingWaitingList,
  assignTable
} from '../services/waitingListService'
import type { WaitingListCreate } from '../models/waitingListModels'

export function usePendingWaitingListQuery() {
  return useQuery({
    queryKey: ['waitingList', 'pending'],
    queryFn: () => getPendingWaitingList(),
  })
}

export function useCreateWaitingListMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (wait: WaitingListCreate) => createWaitingList(wait),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitingList'] })
    },
  })
}

export function useAssignTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, tableId }: { id: number; tableId: number }) => assignTable(id, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitingList'] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}
