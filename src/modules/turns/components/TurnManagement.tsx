import { useState } from 'react'
import {
  useTurnsQuery,
  useToggleTurnActivationMutation,
} from '../hooks/useTurns'
import type { TurnResponse } from '../models/turnModels'

// Componentes del Mantenimiento Abstraídos
import { CreateTurnSheet } from './CreateTurnSheet'
import { EditTurnSheet } from './EditTurnSheet'
import { DeleteTurnDialog } from './DeleteTurnDialog'

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
  Clock,
  Power,
  Calendar,
} from 'lucide-react'

// Utilidad local para recortar segundos de TimeSpan
function formatTimeSpan(time: string) {
  if (!time) return ''
  const parts = time.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return time
}

export function TurnManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('id-asc')

  // Queries y Mutations rápidas
  const { data: pagedTurns, isLoading, isError } = useTurnsQuery(page, pageSize)
  const toggleMutation = useToggleTurnActivationMutation()

  // Estados locales para modales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTurn, setEditingTurn] = useState<TurnResponse | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingTurn, setDeletingTurn] = useState<TurnResponse | null>(null)

  // Abrir crear
  const handleCreateOpen = () => {
    setIsCreateOpen(true)
  }

  // Abrir editar
  const handleEditOpen = (turn: TurnResponse) => {
    setEditingTurn(turn)
    setIsEditOpen(true)
  }

  // Activar/Desactivar rápido
  const handleToggleActive = async (turn: TurnResponse) => {
    try {
      await toggleMutation.mutateAsync({
        id: turn.id,
        active: !turn.isActive,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Abrir borrar
  const handleDeleteOpen = (turn: TurnResponse) => {
    setDeletingTurn(turn)
    setIsDeleteOpen(true)
  }

  // Filtrado local en memoria
  const filteredData = pagedTurns?.data.filter((turn) =>
    turn.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []

  // Ordenamiento local en memoria
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'id-asc') return a.id - b.id
    if (sortBy === 'id-desc') return b.id - a.id
    if (sortBy === 'start-asc') return a.startTime.localeCompare(b.startTime)
    if (sortBy === 'start-desc') return b.startTime.localeCompare(a.startTime)
    return 0
  })

  // Estadísticas reales
  const activeTurnsCount = pagedTurns?.data.filter((t) => t.isActive).length ?? 0

  if (isLoading) {
    return (
      <div className="space-y-6 bg-[#07110F] text-[#F2E9DB] p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
        {/* Skeleton Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-[#101D1A]" />
            <Skeleton className="h-4 w-72 bg-[#101D1A]" />
          </div>
          <Skeleton className="h-9 w-28 bg-[#101D1A]" />
        </div>

        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full bg-[#101D1A] border border-[rgba(196,154,84,0.1)] rounded-lg" />
          <Skeleton className="h-24 w-full bg-[#101D1A] border border-[rgba(196,154,84,0.1)] rounded-lg" />
        </div>

        {/* Skeleton Table Card */}
        <div className="bg-[#101D1A] border border-[rgba(196,154,84,0.20)] rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 bg-[#0B1715]" />
              <Skeleton className="h-3.5 w-56 bg-[#0B1715]" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-48 bg-[#0B1715]" />
              <Skeleton className="h-9 w-32 bg-[#0B1715]" />
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full bg-[#0B1715]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-[#07110F] text-[#F2E9DB] p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#C49A54] font-serif">Mantenimiento de Turnos</h1>
          <p className="text-xs text-[#9D9A91] mt-1">
            Configura los horarios de atención y turnos de servicio (ej. Desayuno, Almuerzo, Cena).
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen} 
          size="sm" 
          className="gap-1.5 cursor-pointer self-start bg-[#C49A54] hover:bg-[#A98245] text-[#07110F] font-semibold transition-colors duration-200 border-none"
        >
          <Plus className="h-4 w-4" />
          Nuevo Turno
        </Button>
      </div>

      {/* Alerta de Error */}
      {isError && (
        <Alert variant="destructive" className="bg-[#101D1A] border-red-900/50 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error de carga</AlertTitle>
          <AlertDescription className="text-xs text-[#9D9A91] flex items-center justify-between gap-4 mt-1">
            <span>No se pudieron cargar los turnos de la base de datos.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] hover:bg-[#101D1A] text-xs shrink-0 cursor-pointer h-7"
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tarjetas de Estadísticas Reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total de Turnos */}
        <div className="bg-[#101D1A] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1715] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Calendar className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Total de turnos</p>
            <p className="text-2xl font-bold text-[#F2E9DB]">{pagedTurns?.totalCount ?? 0}</p>
            <p className="text-[10px] text-[#9D9A91]">Turnos registrados</p>
          </div>
        </div>

        {/* Turnos Activos */}
        <div className="bg-[#101D1A] border border-[rgba(196,154,84,0.20)] p-4 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:border-[#C49A54]/50">
          <div className="p-3 bg-[#0B1715] rounded-full border border-[rgba(196,154,84,0.15)]">
            <Power className="h-6 w-6 text-[#C49A54]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C49A54] uppercase tracking-wider">Turnos activos</p>
            <p className="text-2xl font-bold text-[#F2E9DB]">{activeTurnsCount}</p>
            <p className="text-[10px] text-[#9D9A91]">En la página actual</p>
          </div>
        </div>
      </div>

      {/* Contenedor Principal (Card grande) */}
      <div className="bg-[#101D1A] border border-[rgba(196,154,84,0.20)] rounded-lg overflow-hidden shadow-lg p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#C49A54] font-serif">Turnos registrados</h2>
            <p className="text-xs text-[#9D9A91]">Lista de horarios y turnos de atención</p>
          </div>
          
          {/* Barra de herramientas */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9D9A91]" />
              <Input
                type="text"
                placeholder="Buscar turnos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#0B1715] border-[rgba(196,154,84,0.20)] text-[#F2E9DB] placeholder-[#9D9A91]/50 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] text-xs h-9"
              />
            </div>
            
            {/* Selector de ordenamiento */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 bg-[#0B1715] border-[rgba(196,154,84,0.20)] text-[#F2E9DB] text-xs focus:ring-[#C49A54] h-9">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-[#101D1A] border-[rgba(196,154,84,0.20)] text-[#F2E9DB]">
                <SelectItem value="id-asc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Código Ascendente</SelectItem>
                <SelectItem value="id-desc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Código Descendente</SelectItem>
                <SelectItem value="name-asc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Nombre Z-A</SelectItem>
                <SelectItem value="start-asc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Hora Inicio Asc.</SelectItem>
                <SelectItem value="start-desc" className="text-xs focus:bg-[#0B1715] focus:text-[#C49A54] cursor-pointer">Hora Inicio Desc.</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla */}
        {!pagedTurns || pagedTurns.data.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-[#0B1715] rounded-full border border-[rgba(196,154,84,0.15)] text-[#C49A54]">
                <Clock className="h-10 w-10 stroke-[1.5]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#C49A54]">Aún no tienes turnos registrados</h3>
              <p className="text-xs text-[#9D9A91] max-w-xs mx-auto">
                Crea tu primer turno para comenzar a organizar tu restaurante.
              </p>
            </div>
            <Button 
              onClick={handleCreateOpen} 
              size="sm" 
              className="bg-[#C49A54] hover:bg-[#A98245] text-[#07110F] font-semibold transition-colors duration-200 mt-2"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Nuevo Turno
            </Button>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm text-[#9D9A91] font-medium">No se encontraron turnos que coincidan con la búsqueda.</p>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')} 
              className="text-xs text-[#C49A54] hover:text-[#A98245]"
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[rgba(196,154,84,0.1)]">
            <Table>
              <TableHeader className="bg-[#0B1715]">
                <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1715]">
                  <TableHead className="w-[100px] text-[#C49A54] font-semibold text-xs">Código</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs">Nombre del Turno</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs">Hora de Inicio</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs">Hora de Cierre</TableHead>
                  <TableHead className="w-[120px] text-[#C49A54] font-semibold text-xs">Estado</TableHead>
                  <TableHead className="text-right w-[150px] pr-6 text-[#C49A54] font-semibold text-xs">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((turn) => (
                  <TableRow 
                    key={turn.id} 
                    className="hover:bg-[#0B1715]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-xs text-[#9D9A91]">
                      #{String(turn.id).padStart(3, '0')}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-[#F2E9DB] flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#C49A54] shrink-0" />
                      <span>{turn.name}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-[#F2E9DB]">
                      {formatTimeSpan(turn.startTime)}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-[#F2E9DB]">
                      {formatTimeSpan(turn.endTime)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        turn.isActive
                          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-950/20 text-red-400 border-red-500/20'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${turn.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {turn.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#9D9A91] hover:text-[#C49A54] hover:bg-[#0B1715] cursor-pointer"
                            aria-label="Abrir acciones del turno"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#101D1A] border border-[rgba(196,154,84,0.2)] w-48 text-[#F2E9DB]">
                          <DropdownMenuLabel className="text-[10px] font-semibold text-[#9D9A91] px-2 py-1.5 select-none">
                            Opciones de Turno
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(turn)}
                            disabled={toggleMutation.isPending}
                            className="cursor-pointer text-xs focus:bg-[#0B1715] focus:text-[#C49A54]"
                          >
                            {turn.isActive ? (
                              <>
                                <Power className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                                Desactivar Turno
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-3.5 w-3.5 text-red-500" />
                                Activar Turno
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(turn)}
                            className="cursor-pointer text-xs focus:bg-[#0B1715] focus:text-[#C49A54]"
                          >
                            <Edit2 className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                            Editar Turno
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                          <DropdownMenuItem
                            onClick={() => handleDeleteOpen(turn)}
                            className="cursor-pointer text-xs text-red-400 focus:text-red-300 focus:bg-red-950/20"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                            Eliminar Turno
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            {pagedTurns.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(196,154,84,0.1)] bg-[#0B1715]/20">
                <span className="text-xs text-[#9D9A91]">
                  Página {page} de {pagedTurns.totalPages} ({pagedTurns.totalCount} registros en total)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="h-8 w-8 bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] hover:bg-[#101D1A] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(p + 1, pagedTurns.totalPages))}
                    disabled={page === pagedTurns.totalPages}
                    className="h-8 w-8 bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] hover:bg-[#101D1A] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
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
      <CreateTurnSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditTurnSheet
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        turn={editingTurn}
      />

      <DeleteTurnDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        turn={deletingTurn}
      />
    </div>
  )
}
