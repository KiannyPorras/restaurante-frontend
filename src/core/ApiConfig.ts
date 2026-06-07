import axios from 'axios'

// Configuración de la URL base para el servidor backend restaurante
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiRestaurante = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para agregar headers personalizados a cada petición (como tokens de autenticación)
apiRestaurante.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chefstack_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuesta para manejo centralizado de errores de red o servidor
apiRestaurante.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          console.warn('Sesión no autorizada o expirada. Redirigiendo al login...')
          break
        case 403:
          console.error('No tienes permisos suficientes para realizar esta acción.')
          break
        case 500:
          console.error('Error interno del servidor. Por favor, intenta de nuevo más tarde.')
          break
        default:
          console.error(`Error de API (${status}):`, error.response.data?.message || error.message)
      }
    } else if (error.request) {
      console.error('No se pudo establecer conexión con el servidor. Verifica tu red.')
    } else {
      console.error('Error al configurar la petición:', error.message)
    }
    
    return Promise.reject(error)
  }
)
