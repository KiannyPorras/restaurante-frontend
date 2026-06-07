import { createRootRoute, createRouter } from '@tanstack/react-router'
import { Home } from './routes/Home'


// 1. Ruta Raíz (Layout General)
const rootRoute = createRootRoute({
  component: Home,
})

// 3. Creación del árbol de enrutamiento
const routeTree = rootRoute.addChildren([])

// 4. Instancia del Enrutador
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Registro del tipo del router para autocompletado y tipado estricto
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
