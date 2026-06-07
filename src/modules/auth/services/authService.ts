import { apiRestaurante } from '@/core/ApiConfig'
import type { LoginRequest, LoginResponse } from '../models/authModels'

/**
 * Realiza la petición de inicio de sesión contra el controlador de autenticación del backend.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiRestaurante.post<LoginResponse>('/api/auth/login', credentials)
  return data
}

/*
export function logout(): void {
  localStorage.removeItem('chefstack_token')
  localStorage.removeItem('chefstack_role')
  localStorage.removeItem('chefstack_expires_at')
}
*/

/**
 * Valida si el usuario actual cuenta con una sesión activa y no expirada.
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('chefstack_token')
  const expiresAt = localStorage.getItem('chefstack_expires_at')
  
  if (!token || !expiresAt) return false
  
  const expirationDate = new Date(expiresAt)
  return expirationDate > new Date()
}
