import { useState } from 'react'
import { useSectionsQuery } from '../hooks/useSections'
import type { SectionResponse } from '../models/sectionModels'

// Componentes del Mantenimiento Abstraídos
import { CreateSectionSheet } from './CreateSectionSheet'
import { EditSectionSheet } from './EditSectionSheet'
import { DeleteSectionDialog } from './DeleteSectionDialog'

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
import { Loader2, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

export function SectionManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Queries
  const { data: pagedSections, isLoading, isError, error } = useSectionsQuery(page, pageSize)

  // Estados locales para los modales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionResponse | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingSection, setDeletingSection] = useState<SectionResponse | null>(null)

  // Abrir para crear
  const handleCreateOpen = () => {
    setIsCreateOpen(true)
  }

  // Abrir para editar
  const handleEditOpen = (section: SectionResponse) => {
    setEditingSection(section)
    setIsEditOpen(true)
  }

  // Abrir para borrar
  const handleDeleteOpen = (section: SectionResponse) => {
    setDeletingSection(section)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mantenimiento de Secciones</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Administra las sub-áreas asociadas a cada zona del restaurante.
          </p>
        </div>
        <Button onClick={handleCreateOpen} size="sm" className="gap-1.5 cursor-pointer self-start">
          <Plus className="h-4 w-4" />
          Nueva Sección
        </Button>
      </div>

      {/* Alerta de Error */}
      {isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>No se pudieron cargar las secciones: {error.message}</span>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">Cargando secciones...</p>
          </div>
        ) : !pagedSections || pagedSections.data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground font-medium">No se encontraron secciones registradas.</p>
            <Button variant="link" onClick={handleCreateOpen} className="text-xs text-primary mt-1">
              Crea tu primera sección ahora
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[120px]">Código ID</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Zona Asociada</TableHead>
                  <TableHead className="text-right w-[150px] pr-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedSections.data.map((section) => (
                  <TableRow key={section.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{section.id}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {section.name}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border text-[10px] font-semibold">
                        {section.zoneName}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOpen(section)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOpen(section)}
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
            {pagedSections.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Página {page} de {pagedSections.totalPages} ({pagedSections.totalCount} registros)
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
                    onClick={() => setPage((p) => Math.min(p + 1, pagedSections.totalPages))}
                    disabled={page === pagedSections.totalPages}
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
      <CreateSectionSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <EditSectionSheet
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        section={editingSection}
      />

      <DeleteSectionDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        section={deletingSection}
      />
    </div>
  )
}
