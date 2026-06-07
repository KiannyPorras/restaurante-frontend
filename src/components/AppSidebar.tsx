import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Pizza,
  LayoutDashboard,
  Settings,
  ChevronUp,
  ChevronRight,
  HelpCircle,
  Search,
  BookOpen,
  UserCheck,
  Map,
  Layers,
  Calendar,
  Grid,
  Clock,
  Lock,
} from 'lucide-react'
import { useState } from 'react'

export function AppSidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [searchQuery, setSearchQuery] = useState('')

  const secondaryItems = [
    {
      name: 'Configuración',
      path: '#',
      icon: UserCheck,
    },
    {
      name: 'Soporte y Ayuda',
      path: '#',
      icon: HelpCircle,
    },
    {
      name: 'Documentación',
      path: '#',
      icon: BookOpen,
    },
  ]

  // Lista de items de mantenimiento en la barra
  const operationsItems = [
    { name: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Zonas', path: '/dashboard/zones', icon: Map },
    { name: 'Secciones', path: '/dashboard/sections', icon: Layers },
    { name: 'Mesas', path: '/dashboard/tables', icon: Grid },
    { name: 'Turnos', path: '/dashboard/turns', icon: Calendar },
    { name: 'Lista de Espera', path: '/dashboard/waiting-list', icon: Clock },
    { name: 'Bloqueos de Mesa', path: '/dashboard/locks', icon: Lock },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-[rgba(196,154,84,0.15)] bg-[#0B1519]">
      {/* Cabecera del Sidebar */}
      <SidebarHeader className="h-16 border-b border-[rgba(196,154,84,0.15)] px-4 flex items-center justify-between bg-[#0B1519]">
        <div className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
          <div className="p-2 bg-[#C49A54] text-[#0E1B21] rounded-lg shrink-0">
            <Pizza className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base tracking-wide text-white font-display">
              ChefStack
            </span>
            <span className="text-[10px] text-[#9CA3AF] font-medium">
              Administración
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarContent className="py-2 bg-[#0B1519]">
        {/* Buscador interno */}
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden bg-[#0B1519]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#C49A54]" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-[#0E1B21] border-[rgba(196,154,84,0.20)] text-white placeholder-[#9CA3AF]/50 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] focus-visible:ring-1 focus-visible:ring-offset-0 text-xs"
            />
          </div>
        </div>

        {/* Grupo 1: Operaciones (Acordeón expandido con enlaces de mantenimientos) */}
        <SidebarGroup className="bg-[#0B1519]">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[#9CA3AF] font-semibold text-[10px] uppercase tracking-wider">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={true} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Operaciones" className="text-white hover:bg-[#112128] hover:text-[#C49A54] transition-all duration-200 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-[#C49A54]" />
                      <span className="font-semibold text-xs uppercase tracking-wider">Operaciones</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden text-[#C49A54]" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-[rgba(196,154,84,0.15)] ml-3.5 my-1">
                      {operationsItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPath === item.path
                        return (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className={cn(
                                "transition-all duration-200 cursor-pointer text-white/70 hover:bg-[#112128] hover:text-[#C49A54]",
                                isActive && "bg-[#112128] text-[#C49A54] font-semibold border-l-2 border-[#C49A54] rounded-l-none"
                              )}
                            >
                              <Link to={item.path} className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5 !text-[#C49A54] shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grupo 2: Sistema */}
        <SidebarGroup className="bg-[#0B1519]">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[#9CA3AF] font-semibold text-[10px] uppercase tracking-wider">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Ajustes" className="text-white hover:bg-[#112128] hover:text-[#C49A54] transition-all duration-200 cursor-pointer">
                      <Settings className="h-4 w-4 text-[#C49A54]" />
                      <span className="font-semibold text-xs uppercase tracking-wider">Ajustes</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden text-[#C49A54]" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-[rgba(196,154,84,0.15)] ml-3.5 my-1">
                      {secondaryItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton
                              asChild
                              className="transition-all duration-200 cursor-pointer text-white/70 hover:bg-[#112128] hover:text-[#C49A54]"
                            >
                              <a href={item.path}>
                                <Icon className="h-3.5 w-3.5 mr-1 !text-[#C49A54] shrink-0" />
                                <span>{item.name}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer del Sidebar: Perfil de Usuario */}
      <SidebarFooter className="p-3 border-t border-[rgba(196,154,84,0.15)] bg-[#0B1519]">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#112128] text-white hover:text-[#C49A54] transition-all duration-200 group-data-[collapsible=icon]:justify-center cursor-pointer border border-transparent hover:border-[rgba(196,154,84,0.15)]">
          <div className="h-7 w-7 rounded-md bg-[#C49A54] flex items-center justify-center text-[#0E1B21] text-xs font-bold shrink-0">
            KP
          </div>
          <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold text-white">
              Kianny Porras
            </span>
            <span className="text-[10px] text-[#9CA3AF] leading-none mt-0.5">
              Administrador
            </span>
          </div>
          <ChevronUp className="h-4 w-4 text-[#C49A54] ml-auto group-data-[collapsible=icon]:hidden shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
