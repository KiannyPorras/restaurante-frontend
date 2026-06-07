import { apiRestaurante } from '@/core/ApiConfig'
import type { TableResponse, TableCreate } from '../models/tableModels'
import type { PagedResult } from '@/modules/zones/services/zoneService'

/**
 * Obtiene mesas paginadas.
 */
export async function getTables(page = 1, pageSize = 10): Promise<PagedResult<TableResponse>> {
  const { data } = await apiRestaurante.get<PagedResult<TableResponse>>('/api/tables', {
    params: { page, pageSize }
  })
  return data
}

/**
 * Obtiene mesas asociadas a una sección específica.
 */
export async function getTablesBySection(sectionId: number): Promise<TableResponse[]> {
  const { data } = await apiRestaurante.get<TableResponse[]>(`/api/tables/section/${sectionId}`)
  return data
}

/**
 * Crea una nueva mesa.
 */
export async function createTable(table: TableCreate): Promise<TableResponse> {
  const { data } = await apiRestaurante.post<TableResponse>('/api/tables', table)
  return data
}

/**
 * Actualiza una mesa existente.
 */
export async function updateTable(id: number, table: TableCreate): Promise<TableResponse> {
  const { data } = await apiRestaurante.put<TableResponse>(`/api/tables/${id}`, table)
  return data
}

/**
 * Activa una mesa.
 */
export async function activateTable(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/tables/${id}/activate`)
}

/**
 * Desactiva una mesa.
 */
export async function deactivateTable(id: number): Promise<void> {
  await apiRestaurante.patch(`/api/tables/${id}/deactivate`)
}

/**
 * Elimina una mesa.
 */
export async function deleteTable(id: number): Promise<void> {
  await apiRestaurante.delete(`/api/tables/${id}`)
}
