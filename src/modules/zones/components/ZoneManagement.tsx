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

// Iconos
import { Loader2, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, MoreHorizontal } from 'lucide-react'

export function ZoneManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Queries
  const { data: pagedZones, isLoading, isError, error } = useZonesQuery(page, pageSize)

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

  return (
    <div className="space-y-6">
      {/* Cabecera del Mantenimiento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mantenimiento de Zonas</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Administra las áreas físicas del restaurante (ej. Salón Principal, Terraza, VIP).
          </p>
        </div>
        <Button onClick={handleCreateOpen} size="sm" className="gap-1.5 cursor-pointer self-start">
          <Plus className="h-4 w-4" />
          Nueva Zona
        </Button>
      </div>

      {/* Alerta de Error General */}
      {isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>No se pudieron cargar las zonas: {error.message}</span>
        </div>
      )}

      {/* Tabla de Zonas */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">Cargando zonas...</p>
          </div>
        ) : !pagedZones || pagedZones.data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground font-medium">No se encontraron zonas registradas.</p>
            <Button variant="link" onClick={handleCreateOpen} className="text-xs text-primary mt-1">
              Crea tu primera zona ahora
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[120px]">Código ID</TableHead>
                  <TableHead>Nombre de la Zona</TableHead>
                  <TableHead className="text-right w-[150px] pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedZones.data.map((zone) => (
                  <TableRow key={zone.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{zone.id}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {zone.name}
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
                        <DropdownMenuContent align="end" className="bg-card w-40">
                          <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground px-2 py-1.5 select-none">
                            Opciones de Zona
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditOpen(zone)}
                            className="cursor-pointer text-xs"
                          >
                            <Edit2 className="mr-2 h-3.5 w-3.5" />
                            Editar Zona
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteOpen(zone)}
                            className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Página {page} de {pagedZones.totalPages} ({pagedZones.totalCount} registros en total)
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
                    onClick={() => setPage((p) => Math.min(p + 1, pagedZones.totalPages))}
                    disabled={page === pagedZones.totalPages}
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
