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

// Iconos
import { Loader2, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, ToggleLeft, ToggleRight, MoreHorizontal } from 'lucide-react'

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

  // Queries y Mutations rápidas
  const { data: pagedTurns, isLoading, isError, error } = useTurnsQuery(page, pageSize)
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

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mantenimiento de Turnos</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configura los horarios de atención y turnos de servicio (ej. Desayuno, Almuerzo, Cena).
          </p>
        </div>
        <Button onClick={handleCreateOpen} size="sm" className="gap-1.5 cursor-pointer self-start">
          <Plus className="h-4 w-4" />
          Nuevo Turno
        </Button>
      </div>

      {/* Alerta de Error */}
      {isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>No se pudieron cargar los turnos: {error.message}</span>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">Cargando turnos...</p>
          </div>
        ) : !pagedTurns || pagedTurns.data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground font-medium">No se encontraron turnos registrados.</p>
            <Button variant="link" onClick={handleCreateOpen} className="text-xs text-primary mt-1">
              Crea tu primer turno ahora
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[100px]">Código ID</TableHead>
                  <TableHead>Nombre del Turno</TableHead>
                  <TableHead>Hora de Inicio</TableHead>
                  <TableHead>Hora de Cierre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[180px] pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedTurns.data.map((turn) => (
                  <TableRow key={turn.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{turn.id}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {turn.name}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {formatTimeSpan(turn.startTime)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {formatTimeSpan(turn.endTime)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        turn.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-250'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-655 border-border'
                      }`}>
                        {turn.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card w-48">
                          <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground px-2 py-1.5 select-none">
                            Opciones de Turno
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(turn)}
                            disabled={toggleMutation.isPending}
                            className="cursor-pointer text-xs"
                          >
                            {turn.isActive ? (
                              <>
                                <ToggleRight className="mr-2 h-4.5 w-4.5 text-primary" />
                                Desactivar Turno
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-2 h-4.5 w-4.5 text-muted-foreground" />
                                Activar Turno
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(turn)}
                            className="cursor-pointer text-xs"
                          >
                            <Edit2 className="mr-2 h-3.5 w-3.5" />
                            Editar Turno
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteOpen(turn)}
                            className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Página {page} de {pagedTurns.totalPages} ({pagedTurns.totalCount} registros)
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(p + 1, pagedTurns.totalPages))}
                    disabled={page === pagedTurns.totalPages}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
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
