import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { Landing } from './routes/Landing'
import { Login } from './routes/Login'
import { DashboardLayout } from './routes/dashboard/DashboardLayout'
import { DashboardHome } from './routes/dashboard/DashboardHome'
import { Zones } from './routes/dashboard/Zones'
import { Sections } from './routes/dashboard/Sections'
import { Tables } from './routes/dashboard/Tables'
import { Turns } from './routes/dashboard/Turns'

// 1. Ruta Raíz Principal
const rootRoute = createRootRoute({
  component: Outlet,
})

// 2. Ruta de la Landing Page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

// 3. Ruta de Autenticación (Login)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

// 4. Ruta del Dashboard (Layout General con Sidebar)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
})

// 5. Ruta Index del Dashboard (En el path `/dashboard/`)
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: DashboardHome,
})

// 6. Rutas de Mantenimientos secundarias dentro del Dashboard
const zonesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/zones',
  component: Zones,
})

const sectionsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/sections',
  component: Sections,
})

const tablesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/tables',
  component: Tables,
})

const turnsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/turns',
  component: Turns,
})

// 7. Creación del árbol de enrutamiento
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    zonesRoute,
    sectionsRoute,
    tablesRoute,
    turnsRoute,
  ]),
])

// 8. Instancia del Enrutador
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
