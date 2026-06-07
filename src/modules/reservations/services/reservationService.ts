import { apiRestaurante } from '@/core/ApiConfig'
import type {
  ClientCreate,
  ClientResponse,
  ReservationCreate,
  ReservationResponse,
  ReservationHistoryResponse,
  AvailableTableResponse
} from '../models/reservationModels'

/**
 * Registra un cliente.
 */
export async function createClient(client: ClientCreate): Promise<ClientResponse> {
  const { data } = await apiRestaurante.post<ClientResponse>('/api/clients', client)
  return data
}

/**
 * Crea una reserva.
 */
export async function createReservation(res: ReservationCreate): Promise<ReservationResponse> {
  const { data } = await apiRestaurante.post<ReservationResponse>('/api/reservations', res)
  return data
}

/**
 * Obtiene reservaciones, opcionalmente filtradas por fecha.
 */
export async function getReservations(date?: string): Promise<ReservationResponse[]> {
  const params: Record<string, any> = {}
  if (date) {
    params.date = date
  }
  const { data } = await apiRestaurante.get<any>('/api/reservations', { params })
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Obtiene la bitácora/historial de cambios de una reserva.
 */
export async function getReservationHistory(id: number): Promise<ReservationHistoryResponse[]> {
  const { data } = await apiRestaurante.get<any>(`/api/reservations/${id}/history`)
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Registra la llegada de una reserva (marca como atendido).
 */
export async function attendReservation(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/reservations/${id}/attend`)
}

/**
 * Cancela una reserva.
 */
export async function cancelReservation(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/reservations/${id}/cancel`)
}

/**
 * Obtiene las mesas disponibles para una fecha, hora y aforo específico.
 */
export async function getAvailableTables(
  date: string,
  time: string,
  capacity: number
): Promise<AvailableTableResponse[]> {
  const { data } = await apiRestaurante.get<AvailableTableResponse[]>('/api/tables/available', {
    params: { date, time, capacity }
  })
  return data
}
