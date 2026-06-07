import { Outlet, useRouterState } from '@tanstack/react-router'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { AppSidebar } from '@/components/AppSidebar'
import {
  User,
  Bell,
} from 'lucide-react'

export function DashboardLayout() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex bg-zinc-50 dark:bg-zinc-950 w-full min-h-screen">
          
          {/* SIDEBAR ABSTRAÍDO */}
          <AppSidebar />

          {/* CONTENEDOR INSET DEL PANEL PRINCIPAL */}
          <SidebarInset className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950 min-w-0">
            {/* Header de Contenido */}
            <header className="top-0 z-40 sticky flex justify-between items-center gap-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-6 border-zinc-200/80 dark:border-zinc-800/80 border-b h-16">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg w-9 h-9 text-zinc-500 cursor-pointer" />
                <div className="hidden sm:block bg-zinc-200 dark:bg-zinc-800 w-[1px] h-4" />
                <span className="hidden sm:block font-medium text-zinc-400 dark:text-zinc-500 text-xs">
                  Plataforma / {currentPath === '/dashboard' ? 'Inicio' : 'Demo Suite'}
                </span>
              </div>

              {/* Acciones de la Barra Superior */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500">
                  <Bell className="w-4.5 h-4.5" />
                </Button>
                <div className="bg-zinc-200 dark:bg-zinc-850 w-[1px] h-8" />
                <Button variant="ghost" className="gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 rounded-lg">
                  <User className="w-4.5 h-4.5 text-zinc-550" />
                  <span className="hidden md:inline font-semibold text-xs">Administrador</span>
                </Button>
              </div>
            </header>

            {/* Contenedor del Outlet */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              <Outlet />
            </main>
          </SidebarInset>

        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
