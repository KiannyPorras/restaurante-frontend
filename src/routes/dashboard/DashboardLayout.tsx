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
        <div className="flex bg-[#07110F] text-[#F2E9DB] w-full min-h-screen font-sans">
          
          {/* SIDEBAR */}
          <AppSidebar />

          {/* CONTENEDOR INSET DEL PANEL PRINCIPAL */}
          <SidebarInset className="flex flex-col flex-1 bg-[#07110F] text-[#F2E9DB] min-w-0">
            {/* Header de Contenido Simplificado puro shadcn */}
            <header className="top-0 z-40 sticky flex justify-between items-center bg-[#0B1715] px-6 border-b border-[rgba(196,154,84,0.15)] h-16">
              <div className="flex items-center">
                <SidebarTrigger className="h-8 w-8 text-[#9D9A91] hover:text-[#C49A54] hover:bg-[#101D1A] cursor-pointer transition-colors" />
              </div>

              {/* Acciones de la Barra Superior */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="gap-2 px-2 h-8 text-[#F2E9DB] hover:text-[#C49A54] hover:bg-[#101D1A] cursor-pointer transition-colors">
                  <User className="w-4 h-4 text-[#C49A54]" />
                  <span className="hidden md:inline text-xs font-semibold">Administrador</span>
                </Button>
              </div>
            </header>

            {/* Contenedor del Outlet */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#07110F]">
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
