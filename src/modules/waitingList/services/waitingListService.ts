import { apiRestaurante } from '@/core/ApiConfig'
import type { WaitingListCreate, WaitingListResponse } from '../models/waitingListModels'

/**
 * Agrega un cliente a la lista de espera.
 */
export async function createWaitingList(wait: WaitingListCreate): Promise<WaitingListResponse> {
  const { data } = await apiRestaurante.post<WaitingListResponse>('/api/waiting-list', wait)
  return data
}

/**
 * Obtiene la lista de personas en cola pendientes.
 */
export async function getPendingWaitingList(): Promise<WaitingListResponse[]> {
  const { data } = await apiRestaurante.get<any>('/api/waiting-list/pending')
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Asigna una mesa libre a una persona de la lista de espera, convirtiéndola en reserva activa.
 */
export async function assignTable(id: number, tableId: number): Promise<void> {
  await apiRestaurante.patch(`/api/waiting-list/${id}/assign`, { tableId })
}
