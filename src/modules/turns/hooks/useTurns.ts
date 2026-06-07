import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTurns,
  createTurn,
  updateTurn,
  activateTurn,
  deactivateTurn,
  deleteTurn,
} from '../services/turnService'
import type { TurnCreate } from '../models/turnModels'

export function useTurnsQuery(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['turns', page, pageSize],
    queryFn: () => getTurns(page, pageSize),
  })
}

export function useCreateTurnMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (turn: TurnCreate) => createTurn(turn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] })
    },
  })
}

export function useUpdateTurnMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, turn }: { id: number; turn: TurnCreate }) => updateTurn(id, turn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] })
    },
  })
}

export function useToggleTurnActivationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      active ? activateTurn(id) : deactivateTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] })
    },
  })
}

export function useDeleteTurnMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] })
    },
  })
}
