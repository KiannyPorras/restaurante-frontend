import { useState } from 'react'
import { useZonesQuery } from '../hooks/useZones'
import type { ZoneResponse } from '../models/zoneModels'

// Componentes del Mantenimiento Abstraídos
import { CreateZoneSheet } from './CreateZoneSheet'
import { EditZoneSheet } from './EditZoneSheet'
import { DeleteZoneDialog } from './DeleteZoneDialog'

// Componentes de shadcn UI
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

// Iconos
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Map,
  MapPinned,
} from 'lucide-react'

export function ZoneManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('id-asc')

  // Queries
  const { data: pagedZones, isLoading, isError } = useZonesQuery(page, pageSize)

  // Estados locales para los modales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<ZoneResponse | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingZone, setDeletingZone] = useState<ZoneResponse | null>(null)

  // Handlers para abrir modales
  const handleCreateOpen = () => {
    setIsCreateOpen(true)
  }

  const handleEditOpen = (zone: ZoneResponse) => {
    setEditingZone(zone)
    setIsEditOpen(true)
  }

  const handleDeleteOpen = (zone: ZoneResponse) => {
    setDeletingZone(zone)
    setIsDeleteOpen(true)
  }

  // Filtrado y ordenamiento local en memoria
  const filteredData = pagedZones?.data.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'id-asc') return a.id - b.id
    if (sortBy === 'id-desc') return b.id - a.id
    return 0
  })

  if (isLoading) {
    return (
      <div className="space-y-6 bg-[#0E1B21] text-[#FFFFFF] p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
        {/* Skeleton Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-[#112128]" />
            <Skeleton className="h-4 w-72 bg-[#112128]" />
          </div>
          <Skeleton className="h-9 w-28 bg-[#112128]" />
        </div>

        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full bg-[#112128] border border-[rgba(196,154,84,0.1)] rounded-lg" />
        </div>

        {/* Skeleton Table Card */}
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 bg-[#0B1519]" />
              <Skeleton className="h-3.5 w-56 bg-[#0B1519]" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-48 bg-[#0B1519]" />
              <Skeleton className="h-9 w-32 bg-[#0B1519]" />
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full bg-[#0B1519]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-[#0E1B21] text-[#FFFFFF] p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
      {/* Cabecera del Mantenimiento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Mantenimiento de Zonas</h1>
          <p className="text-xs text-[#9D9A91] mt-1">
            Administra las áreas físicas del restaurante (ej. Salón Principal, Terraza, VIP).
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen} 
          size="sm" 
          className="gap-1.5 cursor-pointer self-start bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 border-none"
        >
          <Plus className="h-4 w-4" />
          Nueva Zona
        </Button>
      </div>

      {/* Alerta de Error General */}
      {isError && (
        <Alert variant="destructive" className="bg-[#112128] border-red-900/50 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error de carga</AlertTitle>
          <AlertDescription className="text-xs text-[#9D9A91] flex items-center justify-between gap-4 mt-1">
            <span>No se pudieron cargar las zonas de la base de datos.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] hover:bg-[#112128] text-xs shrink-0 cursor-pointer h-7"
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tarjeta de Estadística única (sólo la que tiene datos reales en el modelo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Map className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Total de zonas</p>
            <p className="text-2xl font-bold text-[#FFFFFF]">{pagedZones?.totalCount ?? 0}</p>
            <p className="text-[10px] text-[#9D9A91]">Zonas registradas</p>
          </div>
        </div>
      </div>

      {/* Contenedor Principal (Card grande) */}
      <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] rounded-lg overflow-hidden shadow-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#C49A54] font-display">Zonas registradas</h2>
            <p className="text-xs text-[#9D9A91]">Lista de todas las áreas físicas del restaurante</p>
          </div>
          
          {/* Barra de herramientas */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9D9A91]" />
              <Input
                type="text"
                placeholder="Buscar zonas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-[#FFFFFF] placeholder-[#9D9A91]/50 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] text-xs h-9"
              />
            </div>
            
            {/* Selector de ordenamiento */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-[#FFFFFF] text-xs focus:ring-[#C49A54] h-9">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.20)] text-[#FFFFFF]">
                <SelectItem value="id-asc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Código Ascendente</SelectItem>
                <SelectItem value="id-desc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Código Descendente</SelectItem>
                <SelectItem value="name-asc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Nombre Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla o Estados Vacíos */}
        {!pagedZones || pagedZones.data.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)] text-[#C49A54]">
                <Map className="h-10 w-10 stroke-[1.5]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#C49A54]">Aún no tienes zonas registradas</h3>
              <p className="text-xs text-[#9D9A91] max-w-xs mx-auto">
                Crea tu primera zona para comenzar a organizar tu restaurante.
              </p>
            </div>
            <Button 
              onClick={handleCreateOpen} 
              size="sm" 
              className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 mt-2"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva Zona
            </Button>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm text-[#9D9A91] font-medium">No se encontraron zonas que coincidan con tu búsqueda.</p>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')} 
              className="text-xs text-[#C49A54] hover:text-[#A98245]"
            >
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[rgba(196,154,84,0.1)]">
            <Table>
              <TableHeader className="bg-[#0B1519]">
                <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                  <TableHead className="w-[120px] text-[#C49A54] font-semibold text-xs">Código</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs">Nombre de la Zona</TableHead>
                  <TableHead className="text-right w-[150px] pr-6 text-[#C49A54] font-semibold text-xs">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((zone) => (
                  <TableRow 
                    key={zone.id} 
                    className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-xs text-[#9D9A91]">
                      #{String(zone.id).padStart(3, '0')}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-[#FFFFFF] flex items-center gap-2">
                      <MapPinned className="h-3.5 w-3.5 text-[#C49A54] shrink-0" />
                      <span className="capitalize">{zone.name}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#9D9A91] hover:text-[#C49A54] hover:bg-[#0B1519] cursor-pointer"
                            aria-label="Abrir acciones de la zona"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#112128] border border-[rgba(196,154,84,0.2)] w-40 text-[#FFFFFF]">
                          <DropdownMenuLabel className="text-[10px] font-semibold text-[#9D9A91] px-2 py-1.5 select-none">
                            Opciones de Zona
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(zone)}
                            className="cursor-pointer text-xs focus:bg-[#0B1519] focus:text-[#C49A54]"
                          >
                            <Edit2 className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                            Editar Zona
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                          <DropdownMenuItem
                            onClick={() => handleDeleteOpen(zone)}
                            className="cursor-pointer text-xs text-red-400 focus:text-red-300 focus:bg-red-950/20"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                            Eliminar Zona
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación simple */}
            {pagedZones.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(196,154,84,0.1)] bg-[#0B1519]/20">
                <span className="text-xs text-[#9D9A91]">
                  Página {page} de {pagedZones.totalPages} ({pagedZones.totalCount} registros en total)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="h-8 w-8 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] hover:bg-[#112128] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(p + 1, pagedZones.totalPages))}
                    disabled={page === pagedZones.totalPages}
                    className="h-8 w-8 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] hover:bg-[#112128] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Componentes Abstraídos */}
      <CreateZoneSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditZoneSheet
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        zone={editingZone}
      />

      <DeleteZoneDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        zone={deletingZone}
      />
    </div>
  )
}
