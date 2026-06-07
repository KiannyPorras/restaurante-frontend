import { apiRestaurante } from '@/core/ApiConfig'
import type { TurnResponse, TurnCreate } from '../models/turnModels'
import type { PagedResult } from '@/modules/zones/services/zoneService'

/**
 * Obtiene turnos paginados.
 */
export async function getTurns(page = 1, pageSize = 10): Promise<PagedResult<TurnResponse>> {
  const { data } = await apiRestaurante.get<PagedResult<TurnResponse>>('/api/turns', {
    params: { page, pageSize }
  })
  return data
}

/**
 * Crea un nuevo turno.
 */
export async function createTurn(turn: TurnCreate): Promise<TurnResponse> {
  const { data } = await apiRestaurante.post<TurnResponse>('/api/turns', turn)
  return data
}

/**
 * Actualiza un turno existente.
 */
export async function updateTurn(id: number, turn: TurnCreate): Promise<TurnResponse> {
  const { data } = await apiRestaurante.put<TurnResponse>(`/api/turns/${id}`, turn)
  return data
}

/**
 * Activa un turno.
 */
export async function activateTurn(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/turns/${id}/activate`)
}

/**
 * Desactiva un turno.
 */
export async function deactivateTurn(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/turns/${id}/deactivate`)
}

/**
 * Elimina un turno.
 */
export async function deleteTurn(id: number): Promise<void> {
  await apiRestaurante.delete(`/api/turns/${id}`)
}
