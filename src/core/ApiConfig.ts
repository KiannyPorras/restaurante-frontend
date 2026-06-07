import axios from 'axios'

// Configuración de la URL base para el servidor backend
// Por defecto se establece en http://localhost:3000 como fue solicitado,
// con opción a sobreescribirse mediante variables de entorno en producción.
const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Tiempo límite de 15 segundos para peticiones
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para agregar headers personalizados a cada petición (como tokens de autenticación)
api.interceptors.request.use(
  (config) => {
    // Si existe un token de autenticación en localStorage, se adjunta automáticamente
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
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Aquí se pueden centralizar manejadores para códigos de estado recurrentes (401, 403, 500, etc.)
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          console.warn('Sesión no autorizada o expirada. Redirigiendo al login...')
          // Opcional: localStorage.removeItem('chefstack_token') o redirección
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
      // La petición fue hecha pero no hubo respuesta del servidor (error de red / caída)
      console.error('No se pudo establecer conexión con el servidor. Verifica tu red.')
    } else {
      console.error('Error al configurar la petición:', error.message)
    }
    
    return Promise.reject(error)
  }
)
