import { apiRestaurante } from '@/core/ApiConfig'
import type { TableLockCreate, TableLockResponse } from '../models/lockModels'
import type { PagedResult } from '@/modules/zones/services/zoneService'

/**
 * Obtiene bloqueos de mesa.
 */
export async function getLocks(page = 1, pageSize = 10): Promise<PagedResult<TableLockResponse>> {
  const { data } = await apiRestaurante.get<any>('/api/lock-tables', {
    params: { page, pageSize }
  })
  if (Array.isArray(data)) {
    return {
      data,
      totalCount: data.length,
      page,
      pageSize,
      totalPages: 1
    }
  }
  return {
    data: data.data || [],
    totalCount: data.totalCount ?? 0,
    page: data.page ?? page,
    pageSize: data.pageSize ?? pageSize,
    totalPages: data.totalPages ?? 1
  }
}

/**
 * Registra un nuevo bloqueo de mesa.
 */
export async function createLock(lock: TableLockCreate): Promise<TableLockResponse> {
  const { data } = await apiRestaurante.post<TableLockResponse>('/api/lock-tables', lock)
  return data
}

/**
 * Elimina un bloqueo de mesa.
 */
export async function deleteLock(id: number): Promise<void> {
  await apiRestaurante.delete(`/api/lock-tables/${id}`)
}
