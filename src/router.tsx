import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { Landing } from './routes/Landing'
import { DashboardLayout } from './routes/dashboard/DashboardLayout'
import { Home } from './routes/Home'

// 1. Ruta Raíz Principal
const rootRoute = createRootRoute({
  component: Outlet,
})

// 2. Ruta de la Landing Page (En el path principal `/`)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

// 3. Ruta del Dashboard (Layout General con Sidebar)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
})

// 4. Ruta Index del Dashboard (En el path `/dashboard/`)
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: Home,
})

// 5. Creación del árbol de enrutamiento
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute.addChildren([dashboardIndexRoute]),
])

// 6. Instancia del Enrutador
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
