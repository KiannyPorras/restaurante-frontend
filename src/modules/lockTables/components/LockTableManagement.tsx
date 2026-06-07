import { useState } from 'react'
import {
  useLocksQuery,
  useCreateLockMutation,
  useDeleteLockMutation,
} from '../hooks/useLocks'
import { useTablesQuery } from '@/modules/tables/hooks/useTables'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lock,
  Wrench,
  Loader2,
  Check,
} from 'lucide-react'

export function LockTableManagement() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Queries y mutations
  const { data: pagedLocks, isLoading, isError } = useLocksQuery(page, pageSize)
  const { data: pagedTables } = useTablesQuery(1, 100) // Cargar hasta 100 mesas para el select
  const createLockMutation = useCreateLockMutation()
  const deleteLockMutation = useDeleteLockMutation()

  // Estados locales
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingLockId, setDeletingLockId] = useState<number | null>(null)

  // Formulario
  const [selectedTableId, setSelectedTableId] = useState('')
  const [fromDateTime, setFromDateTime] = useState('')
  const [toDateTime, setToDateTime] = useState('')
  const [reason, setReason] = useState('')

  const tablesList = pagedTables?.data ?? []

  const handleCreateOpen = () => {
    setSelectedTableId('')
    setFromDateTime('')
    setToDateTime('')
    setReason('')
    setIsCreateOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTableId || !fromDateTime || !toDateTime || !reason) return

    try {
      await createLockMutation.mutateAsync({
        tableId: Number(selectedTableId),
        from: fromDateTime,
        to: toDateTime,
        reason,
      })
      setIsCreateOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteOpen = (id: number) => {
    setDeletingLockId(id)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingLockId) return
    try {
      await deleteLockMutation.mutateAsync(deletingLockId)
      setIsDeleteOpen(false)
      setDeletingLockId(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 bg-[#0E1B21] text-white p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl font-sans">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Bloqueos de Mesa</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Bloquea mesas temporalmente para mantenimiento o eventos especiales, previniendo que se reserven.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          size="sm"
          className="gap-1.5 cursor-pointer self-start bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 border-none h-9"
        >
          <Plus className="h-4 w-4" />
          Nuevo Bloqueo
        </Button>
      </div>

      {/* Alerta de error */}
      {isError && (
        <Alert variant="destructive" className="bg-[#112128] border-red-900/50 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-[#C49A54] text-xs font-semibold">Error de carga</AlertTitle>
          <AlertDescription className="text-xs text-[#9CA3AF]">
            No se pudieron cargar los bloqueos de mesa de la base de datos.
          </AlertDescription>
        </Alert>
      )}

      {/* Tarjeta Principal */}
      <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#C49A54] font-display">Bloqueos Registrados</h2>
          <p className="text-xs text-[#9CA3AF]">Rango de inhabilitación temporal por mesa</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full bg-[#0B1519]" />
            ))}
          </div>
        ) : !pagedLocks || pagedLocks.data.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)] text-[#C49A54]">
                <Lock className="h-10 w-10 stroke-[1.5]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#C49A54]">No hay bloqueos activos</h3>
              <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
                Todas las mesas están disponibles para reservarse.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[rgba(196,154,84,0.1)]">
            <Table>
              <TableHeader className="bg-[#0B1519]">
                <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Mesa</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Desde</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Hasta</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Motivo</TableHead>
                  <TableHead className="text-right text-[#C49A54] font-semibold text-xs pr-6 border-none">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedLocks.data.map((lock) => (
                  <TableRow
                    key={lock.id}
                    className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                  >
                    <TableCell className="text-xs font-semibold text-white flex items-center gap-2 border-none">
                      <Lock className="h-3.5 w-3.5 text-[#C49A54]" />
                      <span>Mesa {lock.tableNumber || `ID ${lock.tableId}`}</span>
                    </TableCell>
                    <TableCell className="text-xs text-[#9CA3AF] border-none font-mono">
                      {new Date(lock.from).toLocaleString('es-ES')}
                    </TableCell>
                    <TableCell className="text-xs text-[#9CA3AF] border-none font-mono">
                      {new Date(lock.to).toLocaleString('es-ES')}
                    </TableCell>
                    <TableCell className="text-xs text-white border-none flex items-center gap-1.5 mt-2">
                      <Wrench className="h-3.5 w-3.5 text-[#C49A54]" />
                      <span>{lock.reason}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6 border-none">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOpen(lock.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/20 cursor-pointer"
                        aria-label="Eliminar bloqueo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            {pagedLocks.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgba(196,154,84,0.1)] bg-[#0B1519]/20">
                <span className="text-xs text-[#9CA3AF]">
                  Página {page} de {pagedLocks.totalPages}
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
                    onClick={() => setPage((p) => Math.min(p + 1, pagedLocks.totalPages))}
                    disabled={page === pagedLocks.totalPages}
                    className="h-8 w-8 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* PANEL LATERAL: CREAR BLOQUEO */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="bg-[#112128] border-l border-[rgba(196,154,84,0.2)] text-white p-6">
          <SheetHeader>
            <SheetTitle className="text-[#C49A54] font-display text-lg">Nuevo Bloqueo de Mesa</SheetTitle>
            <SheetDescription className="text-xs text-[#9CA3AF]">
              Registra un bloqueo temporal para mantenimiento o limpieza.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="tableLock" className="text-xs font-semibold text-[#C49A54]">Seleccionar Mesa</Label>
              <Select value={selectedTableId} onValueChange={setSelectedTableId} required>
                <SelectTrigger className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-10">
                  <SelectValue placeholder="Elige mesa..." />
                </SelectTrigger>
                <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.2)] text-white">
                  {tablesList.map((table) => (
                    <SelectItem key={table.id} value={table.id.toString()} className="text-xs cursor-pointer focus:bg-[#0B1519] focus:text-[#C49A54]">
                      Mesa {table.number} ({table.sectionName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fromLock" className="text-xs font-semibold text-[#C49A54]">Desde (Fecha y Hora)</Label>
              <Input
                id="fromLock"
                type="datetime-local"
                value={fromDateTime}
                onChange={(e) => setFromDateTime(e.target.value)}
                required
                className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="toLock" className="text-xs font-semibold text-[#C49A54]">Hasta (Fecha y Hora)</Label>
              <Input
                id="toLock"
                type="datetime-local"
                value={toDateTime}
                onChange={(e) => setToDateTime(e.target.value)}
                required
                className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reasonLock" className="text-xs font-semibold text-[#C49A54]">Motivo / Detalles</Label>
              <Input
                id="reasonLock"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Ej. Limpieza profunda, Mantenimiento de patas"
                className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-10"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <SheetClose asChild>
                <Button
                  type="button"
                  className="flex-1 bg-[#0B1519] border border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-10"
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={createLockMutation.isPending}
                className="flex-1 bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-10 cursor-pointer"
              >
                {createLockMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Check className="h-3.5 w-3.5 mr-1" />
                )}
                Registrar Bloqueo
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* DIÁLOGO ALERTA ELIMINACIÓN */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="sm:max-w-md bg-[#112128] border border-[rgba(196,154,84,0.2)] text-white p-6">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <AlertDialogTitle className="text-[#C49A54] font-display text-lg">¿Confirmar desbloqueo?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-[#9CA3AF] leading-relaxed">
              Esta acción habilitará nuevamente la mesa seleccionada para recibir reservaciones públicas. ¿Desea continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 flex flex-row justify-end pt-4">
            <AlertDialogCancel
              onClick={() => setIsDeleteOpen(false)}
              className="bg-[#0B1519] border border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-9 cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLockMutation.isPending}
              className="bg-red-950/40 border border-red-500/30 text-red-200 hover:bg-red-900/50 text-xs h-9 cursor-pointer"
            >
              {deleteLockMutation.isPending && (
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              )}
              Habilitar Mesa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
