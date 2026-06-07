import { useState } from 'react'
import {
  useTablesQuery,
  useToggleTableActivationMutation,
} from '../hooks/useTables'
import { useAllSectionsQuery } from '@/modules/sections/hooks/useSections'
import type { TableResponse } from '../models/tableModels'

// Componentes del Mantenimiento Abstraídos
import { CreateTableSheet } from './CreateTableSheet'
import { EditTableSheet } from './EditTableSheet'
import { DeleteTableDialog } from './DeleteTableDialog'

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

import { TableMap } from './TableMap'

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
  Armchair,
  Power,
  Users,
  Map,
  Grid,
} from 'lucide-react'

export function TableManagement() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('all')
  const [sortBy, setSortBy] = useState('id-asc')

  // Queries y mutations
  const { data: pagedTables, isLoading: isLoadingTables, isError: isErrorTables } = useTablesQuery(page, pageSize)
  const { data: sections = [], isLoading: isLoadingSections } = useAllSectionsQuery()
  const toggleMutation = useToggleTableActivationMutation()

  // Estados locales para los modales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<TableResponse | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingTable, setDeletingTable] = useState<TableResponse | null>(null)

  // Abrir crear
  const handleCreateOpen = () => {
    setIsCreateOpen(true)
  }

  // Abrir editar
  const handleEditOpen = (table: TableResponse) => {
    setEditingTable(table)
    setIsEditOpen(true)
  }

  // Activar/Desactivar rápido
  const handleToggleActive = async (table: TableResponse) => {
    try {
      await toggleMutation.mutateAsync({
        id: table.id,
        active: !table.isActive,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Abrir borrar
  const handleDeleteOpen = (table: TableResponse) => {
    setDeletingTable(table)
    setIsDeleteOpen(true)
  }

  // Filtrado local en memoria
  const filteredData = pagedTables?.data.filter((table) => {
    const matchesSearch = table.number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSection = selectedSectionId === 'all' || table.sectionId.toString() === selectedSectionId
    return matchesSearch && matchesSection
  }) ?? []

  // Ordenamiento local en memoria
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'number-asc') return a.number.localeCompare(b.number, undefined, { numeric: true })
    if (sortBy === 'number-desc') return b.number.localeCompare(a.number, undefined, { numeric: true })
    if (sortBy === 'id-asc') return a.id - b.id
    if (sortBy === 'id-desc') return b.id - a.id
    if (sortBy === 'capacity-asc') return a.capacity - b.capacity
    if (sortBy === 'capacity-desc') return b.capacity - a.capacity
    return 0
  })

  // Estadísticas reales
  const activeTablesCount = pagedTables?.data.filter((t) => t.isActive).length ?? 0
  const totalCapacity = pagedTables?.data.reduce((sum, t) => sum + t.capacity, 0) ?? 0

  const isLoading = isLoadingTables || isLoadingSections

  if (isLoading) {
    return (
      <div className="space-y-6 bg-[#0E1B21] text-white p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
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
          <Skeleton className="h-24 w-full bg-[#112128] border border-[rgba(196,154,84,0.1)] rounded-lg" />
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
    <div className="space-y-6 bg-[#0E1B21] text-white p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Mantenimiento de Mesas</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Gestiona la asignación de mesas en las secciones, su capacidad de personas y estado físico de servicio.
          </p>
        </div>
        
        {/* Selector de Vista e Inserción de Nueva Mesa */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="bg-[#0B1519] border border-[rgba(196,154,84,0.20)] p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-[#C49A54] text-[#0E1B21]'
                  : 'text-white hover:text-[#C49A54]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Ver Croquis
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-[#C49A54] text-[#0E1B21]'
                  : 'text-white hover:text-[#C49A54]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Ver Lista
            </button>
          </div>

          <Button 
            onClick={handleCreateOpen} 
            size="sm" 
            className="gap-1.5 cursor-pointer bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 border-none h-9"
          >
            <Plus className="h-4 w-4" />
            Nueva Mesa
          </Button>
        </div>
      </div>

      {/* Alerta de Error */}
      {isErrorTables && (
        <Alert variant="destructive" className="bg-[#112128] border-red-900/50 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error de carga</AlertTitle>
          <AlertDescription className="text-xs text-[#9CA3AF] flex items-center justify-between gap-4 mt-1">
            <span>No se pudieron cargar las mesas de la base de datos.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] text-xs shrink-0 cursor-pointer h-7"
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de Estadísticas Reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de Mesas */}
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Armchair className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Total de mesas</p>
            <p className="text-2xl font-bold text-white">{pagedTables?.totalCount ?? 0}</p>
            <p className="text-[10px] text-[#9CA3AF]">Mesas registradas</p>
          </div>
        </div>

        {/* Mesas Activas */}
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Power className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Mesas activas</p>
            <p className="text-2xl font-bold text-white">{activeTablesCount}</p>
            <p className="text-[10px] text-[#9CA3AF]">En la página actual</p>
          </div>
        </div>

        {/* Capacidad Total */}
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Users className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Aforo en página</p>
            <p className="text-2xl font-bold text-white">{totalCapacity} pers.</p>
            <p className="text-[10px] text-[#9CA3AF]">Capacidad total de comensales</p>
          </div>
        </div>
      </div>

      {/* Vista de Croquis o Lista de Tabla */}
      {viewMode === 'map' ? (
        <TableMap
          onEditClick={handleEditOpen}
          onDeleteClick={handleDeleteOpen}
          onCreateClick={handleCreateOpen}
        />
      ) : (
        <div className="bg-[#112128] border border-[rgba(196,154,84,0.20)] rounded-lg overflow-hidden shadow-lg p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#C49A54] font-display">Mesas registradas</h2>
              <p className="text-xs text-[#9CA3AF]">Lista de todas las mesas del restaurante</p>
            </div>
            
            {/* Barra de herramientas */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Buscador */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="Buscar mesas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-white placeholder-[#9CA3AF]/50 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] text-xs h-9"
                />
              </div>
              
              {/* Filtro por Sección */}
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                <SelectTrigger className="w-full sm:w-44 bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-white text-xs focus:ring-[#C49A54] h-9">
                  <SelectValue placeholder="Filtrar por Sección..." />
                </SelectTrigger>
                <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.20)] text-white">
                  <SelectItem value="all" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Todas las secciones</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()} className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selector de ordenamiento */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-44 bg-[#0B1519] border-[rgba(196,154,84,0.20)] text-white text-xs focus:ring-[#C49A54] h-9">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.20)] text-white">
                  <SelectItem value="id-asc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Código Ascendente</SelectItem>
                  <SelectItem value="id-desc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Código Descendente</SelectItem>
                  <SelectItem value="number-asc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Número de Mesa Asc.</SelectItem>
                  <SelectItem value="number-desc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Número de Mesa Desc.</SelectItem>
                  <SelectItem value="capacity-asc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Menor Capacidad</SelectItem>
                  <SelectItem value="capacity-desc" className="text-xs focus:bg-[#0B1519] focus:text-[#C49A54] cursor-pointer">Mayor Capacidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla o Estados Vacíos */}
          {!pagedTables || pagedTables.data.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)] text-[#C49A54]">
                  <Armchair className="h-10 w-10 stroke-[1.5]" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#C49A54]">Aún no tienes mesas registradas</h3>
                <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
                  Crea tu primera mesa para comenzar a organizar tu restaurante.
                </p>
              </div>
              <Button 
                onClick={handleCreateOpen} 
                size="sm" 
                className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 mt-2"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Nueva Mesa
              </Button>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-[#9CA3AF] font-medium">No se encontraron mesas que coincidan con los filtros.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSectionId('all')
                }} 
                className="text-xs text-[#C49A54] hover:text-[#A98245]"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[rgba(196,154,84,0.1)]">
              <Table>
                <TableHeader className="bg-[#0B1519]">
                  <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                    <TableHead className="w-[100px] text-[#C49A54] font-semibold text-xs">Código</TableHead>
                    <TableHead className="text-[#C49A54] font-semibold text-xs">Número de Mesa</TableHead>
                    <TableHead className="text-[#C49A54] font-semibold text-xs">Capacidad</TableHead>
                    <TableHead className="text-[#C49A54] font-semibold text-xs">Sección (Zona)</TableHead>
                    <TableHead className="w-[120px] text-[#C49A54] font-semibold text-xs">Estado</TableHead>
                    <TableHead className="text-right w-[150px] pr-6 text-[#C49A54] font-semibold text-xs">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((table) => (
                    <TableRow 
                      key={table.id} 
                      className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                    >
                      <TableCell className="font-mono text-xs text-[#9CA3AF]">
                        #{String(table.id).padStart(3, '0')}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-white flex items-center gap-2">
                        <Armchair className="h-3.5 w-3.5 text-[#C49A54] shrink-0" />
                        <span>Mesa {table.number}</span>
                      </TableCell>
                      <TableCell className="text-xs text-white">
                        {table.capacity} personas
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#0B1519] text-[#C49A54] border border-[rgba(196,154,84,0.15)] text-[10px] font-semibold mr-1">
                          {table.sectionName}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF]/60">({table.zoneName})</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          table.isActive
                            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-950/20 text-red-400 border-red-500/20'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${table.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {table.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#9CA3AF] hover:text-[#C49A54] hover:bg-[#0B1519] cursor-pointer"
                              aria-label="Abrir acciones de la mesa"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#112128] border border-[rgba(196,154,84,0.2)] w-48 text-white">
                            <DropdownMenuLabel className="text-[10px] font-semibold text-[#9CA3AF] px-2 py-1.5 select-none">
                              Opciones de Mesa
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(table)}
                              disabled={toggleMutation.isPending}
                              className="cursor-pointer text-xs focus:bg-[#0B1519] focus:text-[#C49A54]"
                            >
                              {table.isActive ? (
                                <>
                                  <Power className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                                  Desactivar Mesa
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-3.5 w-3.5 text-red-500" />
                                  Activar Mesa
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditOpen(table)}
                              className="cursor-pointer text-xs focus:bg-[#0B1519] focus:text-[#C49A54]"
                            >
                              <Edit2 className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                              Editar Mesa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteOpen(table)}
                              className="cursor-pointer text-xs text-red-400 focus:text-red-300 focus:bg-red-950/20"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                              Eliminar Mesa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {pagedTables.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(196,154,84,0.1)] bg-[#0B1519]/20">
                  <span className="text-xs text-[#9CA3AF]">
                    Página {page} de {pagedTables.totalPages} ({pagedTables.totalCount} registros en total)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="h-8 w-8 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.min(p + 1, pagedTables.totalPages))}
                      disabled={page === pagedTables.totalPages}
                      className="h-8 w-8 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Componentes Abstraídos */}
      <CreateTableSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditTableSheet
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        table={editingTable}
      />

      <DeleteTableDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        table={deletingTable}
      />
    </div>
  )
}
