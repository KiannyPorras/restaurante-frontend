import { apiRestaurante } from '@/core/ApiConfig'
import type { SectionResponse, SectionCreate } from '../models/sectionModels'
import type { PagedResult } from '@/modules/zones/services/zoneService'

/**
 * Obtiene secciones paginadas desde la API.
 */
export async function getSections(page = 1, pageSize = 10): Promise<PagedResult<SectionResponse>> {
  const { data } = await apiRestaurante.get<PagedResult<SectionResponse>>('/api/sections', {
    params: { page, pageSize }
  })
  return data
}

/**
 * Obtiene todas las secciones filtradas por zona (sin paginar, para selectores).
 */
export async function getSectionsByZone(zoneId: number): Promise<SectionResponse[]> {
  const { data } = await apiRestaurante.get<SectionResponse[]>(`/api/sections/zone/${zoneId}`)
  return data
}

/**
 * Obtiene todas las secciones en una lista general (con un tamaño de página de 100).
 */
export async function getAllSectionsList(): Promise<SectionResponse[]> {
  const { data } = await apiRestaurante.get<PagedResult<SectionResponse>>('/api/sections', {
    params: { page: 1, pageSize: 100 }
  })
  return data.data
}

/**
 * Crea una nueva sección.
 */
export async function createSection(section: SectionCreate): Promise<SectionResponse> {
  const { data } = await apiRestaurante.post<SectionResponse>('/api/sections', section)
  return data
}

/**
 * Actualiza los datos de una sección existente.
 */
export async function updateSection(id: number, section: SectionCreate): Promise<SectionResponse> {
  const { data } = await apiRestaurante.put<SectionResponse>(`/api/sections/${id}`, section)
  return data
}

/**
 * Elimina una sección por su ID.
 */
export async function deleteSection(id: number): Promise<void> {
  await apiRestaurante.delete(`/api/sections/${id}`)
}
