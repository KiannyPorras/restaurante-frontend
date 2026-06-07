import { Outlet } from '@tanstack/react-router'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/AppSidebar'

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex bg-zinc-50 dark:bg-zinc-950 w-full min-h-screen">
          
          {/* SIDEBAR ABSTRAÍDO */}
          <AppSidebar />

          {/* CONTENEDOR INSET DEL PANEL PRINCIPAL */}
          <SidebarInset className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950 min-w-0">
            {/* Header de Contenido Simplificado */}
            <header className="top-0 z-40 sticky flex justify-between items-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-6 border-zinc-200/80 dark:border-zinc-800/80 border-b h-16">
              <div className="flex items-center">
                <SidebarTrigger className="hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg w-9 h-9 text-zinc-500 cursor-pointer" />
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
