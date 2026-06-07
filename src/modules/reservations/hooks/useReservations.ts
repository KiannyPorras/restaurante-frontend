import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createClient,
  createReservation,
  getReservations,
  getReservationHistory,
  attendReservation,
  cancelReservation,
  getAvailableTables
} from '../services/reservationService'
import type { ClientCreate, ReservationCreate } from '../models/reservationModels'

export function useReservationsQuery(date?: string) {
  return useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
  })
}

export function useReservationHistoryQuery(id: number, enabled = false) {
  return useQuery({
    queryKey: ['reservations', id, 'history'],
    queryFn: () => getReservationHistory(id),
    enabled: enabled && !!id,
  })
}

export function useCreateClientMutation() {
  return useMutation({
    mutationFn: (client: ClientCreate) => createClient(client),
  })
}

export function useCreateReservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (res: ReservationCreate) => createReservation(res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useAttendReservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => attendReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useCancelReservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export function useAvailableTablesQuery(date: string, time: string, capacity: number, enabled = false) {
  return useQuery({
    queryKey: ['tables', 'available', date, time, capacity],
    queryFn: () => getAvailableTables(date, time, capacity),
    enabled: enabled && !!date && !!time && capacity > 0,
  })
}
