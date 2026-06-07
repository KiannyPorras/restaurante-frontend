import { useState } from 'react'
import {
  useTablesQuery,
  useToggleTableActivationMutation,
} from '../hooks/useTables'
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

// Iconos
import { Loader2, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react'

export function TableManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Queries y mutations rápidas
  const { data: pagedTables, isLoading, isError, error } = useTablesQuery(page, pageSize)
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

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mantenimiento de Mesas</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestiona la asignación de mesas en las secciones, su capacidad de personas y estado físico de servicio.
          </p>
        </div>
        <Button onClick={handleCreateOpen} size="sm" className="gap-1.5 cursor-pointer self-start">
          <Plus className="h-4 w-4" />
          Nueva Mesa
        </Button>
      </div>

      {/* Alerta de Error */}
      {isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>No se pudieron cargar las mesas: {error.message}</span>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">Cargando mesas...</p>
          </div>
        ) : !pagedTables || pagedTables.data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground font-medium">No se encontraron mesas registradas.</p>
            <Button variant="link" onClick={handleCreateOpen} className="text-xs text-primary mt-1">
              Crea tu primera mesa ahora
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[100px]">Código ID</TableHead>
                  <TableHead>Número de Mesa</TableHead>
                  <TableHead>Capacidad (Pers.)</TableHead>
                  <TableHead>Sección (Zona)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[180px] pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedTables.data.map((table) => (
                  <TableRow key={table.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{table.id}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      Mesa {table.number}
                    </TableCell>
                    <TableCell className="text-xs">
                      {table.capacity} personas
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {table.sectionName} ({table.zoneName})
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        table.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-250'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-655 border-border'
                      }`}>
                        {table.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1.5">
                        {/* Activar/Desactivar Interruptor */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(table)}
                          title={table.isActive ? 'Desactivar mesa' : 'Activar mesa'}
                          disabled={toggleMutation.isPending}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          {table.isActive ? (
                            <ToggleRight className="h-4.5 w-4.5 text-primary" />
                          ) : (
                            <ToggleLeft className="h-4.5 w-4.5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOpen(table)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOpen(table)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            {pagedTables.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Página {page} de {pagedTables.totalPages} ({pagedTables.totalCount} registros)
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
                    onClick={() => setPage((p) => Math.min(p + 1, pagedTables.totalPages))}
                    disabled={page === pagedTables.totalPages}
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
