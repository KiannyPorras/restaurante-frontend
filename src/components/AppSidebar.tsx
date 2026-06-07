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
    <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {/* Cabecera del Sidebar */}
      <SidebarHeader className="h-16 border-b border-zinc-100 dark:border-zinc-850 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
          <div className="p-2 bg-gradient-to-tr from-amber-600 to-orange-500 text-white rounded-xl shadow-md shadow-amber-500/20 shrink-0">
            <Pizza className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm leading-none tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              ChefStack
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
              Restaurante Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarContent className="py-4">
        {/* Buscador interno (oculto en colapsado) */}
        <div className="px-3 mb-4 group-data-[collapsible=icon]:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Buscar panel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-zinc-100/50 dark:bg-zinc-800/50 border-0 focus-visible:ring-1 focus-visible:ring-amber-500"
            />
          </div>
        </div>

        {/* Grupo 1: Navegación Principal (Acordeón de Operaciones) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400 dark:text-zinc-500 font-bold uppercase text-[10px] tracking-wider px-3 group-data-[collapsible=icon]:hidden">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={true} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Operaciones" className="w-full text-zinc-700 dark:text-zinc-350">
                      <LayoutDashboard className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Operaciones</span>
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

        {/* Grupo 2: Sistema (Acordeón de Ajustes) */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-zinc-400 dark:text-zinc-500 font-bold uppercase text-[10px] tracking-wider px-3 group-data-[collapsible=icon]:hidden">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Ajustes" className="w-full text-zinc-700 dark:text-zinc-350">
                      <Settings className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Ajustes</span>
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
                                <Icon className="h-3.5 w-3.5 mr-1 shrink-0" />
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
      <SidebarFooter className="p-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-semibold shrink-0">
            KP
          </div>
          <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold leading-none text-zinc-800 dark:text-zinc-200">
              Kianny Porras
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-none">
              kianny@chefstack.com
            </span>
          </div>
          <ChevronUp className="h-4 w-4 text-zinc-400 ml-auto group-data-[collapsible=icon]:hidden shrink-0" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
