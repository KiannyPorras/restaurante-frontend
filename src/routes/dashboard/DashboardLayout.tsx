import { Outlet } from '@tanstack/react-router'
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
} from 'lucide-react'
import { isAuthenticated } from '@/modules/auth/services/authService'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function DashboardLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    // Guardia de Autenticación
    if (!isAuthenticated()) {
      navigate({ to: '/login' })
    }
  }, [navigate])

  if (!isAuthenticated()) {
    return null
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex bg-background w-full min-h-screen">
          
          {/* SIDEBAR */}
          <AppSidebar />

          {/* CONTENEDOR INSET DEL PANEL PRINCIPAL */}
          <SidebarInset className="flex flex-col flex-1 bg-background min-w-0">
            {/* Header de Contenido Simplificado puro shadcn */}
            <header className="top-0 z-40 sticky flex justify-between items-center bg-background px-6 border-b border-border h-16">
              <div className="flex items-center">
                <SidebarTrigger className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Acciones de la Barra Superior */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="gap-2 px-2 h-8">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="hidden md:inline text-xs">Administrador</span>
                </Button>
              </div>
            </header>

            {/* Contenedor del Outlet */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-5xl mx-auto w-full">
                <Outlet />
              </div>
            </main>
          </SidebarInset>

        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
