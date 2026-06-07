import { Link, useRouterState } from '@tanstack/react-router'
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

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      {/* Cabecera del Sidebar (Estilos puros shadcn) */}
      <SidebarHeader className="h-16 border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shrink-0">
            <Pizza className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-foreground">
              ChefStack
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Administración
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarContent className="py-2">
        {/* Buscador interno */}
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-background"
            />
          </div>
        </div>

        {/* Grupo 1: Operaciones */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={true} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Operaciones">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Operaciones</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={currentPath === '/dashboard'}>
                          <Link to="/dashboard">
                            <span>Panel Principal</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grupo 2: Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Ajustes">
                      <Settings className="h-4 w-4" />
                      <span>Ajustes</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {secondaryItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton asChild>
                              <a href={item.path}>
                                <Icon className="h-3.5 w-3.5 mr-1" />
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
      <SidebarFooter className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center">
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs font-semibold shrink-0">
            KP
          </div>
          <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-medium text-foreground">
              Kianny Porras
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Administrador
            </span>
          </div>
          <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto group-data-[collapsible=icon]:hidden shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
