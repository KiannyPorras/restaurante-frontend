import { apiRestaurante } from '@/core/ApiConfig'
import type { ZoneResponse, ZoneCreate } from '../models/zoneModels'

export interface PagedResult<T> {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  data: T[]
}

/**
 * Obtiene zonas paginadas desde la API.
 */
export async function getZones(page = 1, pageSize = 10): Promise<PagedResult<ZoneResponse>> {
  const { data } = await apiRestaurante.get<PagedResult<ZoneResponse>>('/api/zones', {
    params: { page, pageSize }
  })
  return data
}

/**
 * Obtiene todas las zonas disponibles en una sola lista (útil para selectores/comboboxes).
 */
export async function getAllZonesList(): Promise<ZoneResponse[]> {
  const { data } = await apiRestaurante.get<PagedResult<ZoneResponse>>('/api/zones', {
    params: { page: 1, pageSize: 100 }
  })
  return data.data
}

/**
 * Obtiene una zona específica por su ID.
 */
export async function getZoneById(id: number): Promise<ZoneResponse> {
  const { data } = await apiRestaurante.get<ZoneResponse>(`/api/zones/${id}`)
  return data
}

/**
 * Crea una nueva zona en el servidor.
 */
export async function createZone(zone: ZoneCreate): Promise<ZoneResponse> {
  const { data } = await apiRestaurante.post<ZoneResponse>('/api/zones', zone)
  return data
}

/**
 * Actualiza los datos de una zona existente.
 */
export async function updateZone(id: number, zone: ZoneCreate): Promise<ZoneResponse> {
  const { data } = await apiRestaurante.put<ZoneResponse>(`/api/zones/${id}`, zone)
  return data
}

/**
 * Elimina una zona por su ID.
 */
export async function deleteZone(id: number): Promise<void> {
  await apiRestaurante.delete(`/api/zones/${id}`)
}
