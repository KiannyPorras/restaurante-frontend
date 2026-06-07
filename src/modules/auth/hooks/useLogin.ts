import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login } from '../services/authService'
import type { LoginRequest, LoginResponse } from '../models/authModels'
import axios from 'axios'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (data) => {
      // Guardar información de sesión en el almacenamiento local
      localStorage.setItem('chefstack_token', data.token)
      localStorage.setItem('chefstack_role', data.role)
      localStorage.setItem('chefstack_expires_at', data.expiresAt)
      
      // Redirigir al dashboard tras un login exitoso
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      // Formatear mensaje de error en base a la respuesta del servidor
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data?.message
        if (serverMessage) {
          error.message = serverMessage
        }
      }
    }
  })
}
