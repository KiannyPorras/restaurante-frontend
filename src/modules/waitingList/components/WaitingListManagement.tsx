import { useState } from 'react'
import {
  usePendingWaitingListQuery,
  useAssignTableMutation,
} from '../hooks/useWaitingList'
import { useAvailableTablesQuery } from '@/modules/reservations/hooks/useReservations'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Clock, Check, Loader2, Armchair, Users, AlertTriangle } from 'lucide-react'

export function WaitingListManagement() {
  const { data: pendingList = [], isLoading, isError } = usePendingWaitingListQuery()
  const assignTableMutation = useAssignTableMutation()

  // Estados locales para el modal de asignación
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  // Query de mesas disponibles para la fecha, hora y capacidad del cliente seleccionado
  const { data: availableTables = [], isLoading: isLoadingTables } = useAvailableTablesQuery(
    selectedEntry?.desiredDay ?? '',
    selectedEntry?.desiredTime ?? '',
    selectedEntry?.guestCount ?? 0,
    isAssignOpen && !!selectedEntry
  )

  const handleOpenAssign = (entry: any) => {
    setSelectedEntry(entry)
    setSelectedTableId('')
    setIsAssignOpen(true)
  }

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntry || !selectedTableId) return

    try {
      await assignTableMutation.mutateAsync({
        id: selectedEntry.id,
        tableId: Number(selectedTableId),
      })
      setIsAssignOpen(false)
      setSelectedEntry(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 bg-[#0E1B21] text-white p-6 md:p-8 rounded-xl border border-[rgba(196,154,84,0.20)] shadow-2xl font-sans">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Lista de Espera</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Gestiona los clientes en cola de espera. Asigna una mesa disponible para convertirlos en una reservación activa.
          </p>
        </div>
      </div>

      {/* Tarjeta Principal */}
      <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#C49A54] font-display">Clientes en Cola</h2>
          <p className="text-xs text-[#9CA3AF]">Lista de esperas pendientes de asignación de mesa</p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#C49A54] border-t-transparent" />
            <p className="text-xs text-[#9CA3AF]">Cargando lista de espera...</p>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-xs text-red-400">
            Error al conectar con la API de Lista de Espera.
          </div>
        ) : pendingList.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-[#0B1519] rounded-full border border-[rgba(196,154,84,0.15)] text-[#C49A54]">
                <Clock className="h-10 w-10 stroke-[1.5]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#C49A54]">Cola de Espera Vacía</h3>
              <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
                No hay clientes esperando mesa en este momento.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-[rgba(196,154,84,0.1)]">
            <Table>
              <TableHeader className="bg-[#0B1519]">
                <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Cliente</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Teléfono</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Día</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Hora</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Personas</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Zona Preferida</TableHead>
                  <TableHead className="text-[#C49A54] font-semibold text-xs border-none">Estado</TableHead>
                  <TableHead className="text-right text-[#C49A54] font-semibold text-xs pr-6 border-none">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingList.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                  >
                    <TableCell className="text-xs font-semibold text-white border-none">
                      {entry.clientName} {entry.clientLastName}
                    </TableCell>
                    <TableCell className="text-xs text-[#9CA3AF] border-none font-mono">
                      {entry.clientPhone}
                    </TableCell>
                    <TableCell className="text-xs text-white border-none">
                      {entry.desiredDay}
                    </TableCell>
                    <TableCell className="text-xs text-white border-none font-mono">
                      {entry.desiredTime.slice(0, 5)}
                    </TableCell>
                    <TableCell className="text-xs text-white border-none font-semibold">
                      {entry.guestCount}
                    </TableCell>
                    <TableCell className="border-none">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#0B1519] text-[#C49A54] border border-[rgba(196,154,84,0.15)] text-[10px] font-semibold">
                        {entry.preferZone}
                      </span>
                    </TableCell>
                    <TableCell className="border-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-950/20 text-amber-400 border-amber-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {entry.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6 border-none">
                      <Button
                        onClick={() => handleOpenAssign(entry)}
                        size="sm"
                        className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold text-xs transition-colors duration-200 cursor-pointer h-8"
                      >
                        <Armchair className="h-3.5 w-3.5 mr-1" />
                        Asignar Mesa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* MODAL DE ASIGNACIÓN DE MESA */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-md bg-[#112128] border border-[rgba(196,154,84,0.2)] text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-[#C49A54] font-display text-lg flex items-center gap-2">
              <Armchair className="h-5 w-5" />
              Asignar Mesa a Reserva
            </DialogTitle>
            <DialogDescription className="text-xs text-[#9CA3AF]">
              Selecciona una mesa disponible que cumpla con el aforo e invitados del cliente en cola.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmAssign} className="space-y-4 mt-4">
            {selectedEntry && (
              <div className="bg-[#0B1519] border border-[rgba(196,154,84,0.1)] rounded-lg p-3 space-y-2 text-xs">
                <p><strong className="text-[#C49A54]">Cliente:</strong> {selectedEntry.clientName} {selectedEntry.clientLastName}</p>
                <p className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#C49A54]" />
                  <span>Aforo requerido: <strong>{selectedEntry.guestCount} personas</strong></span>
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  Fecha: {selectedEntry.desiredDay} | Hora: {selectedEntry.desiredTime.slice(0, 5)}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="tableAssign" className="text-xs font-semibold text-[#C49A54]">Mesas Disponibles</Label>
              {isLoadingTables ? (
                <div className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-[#0B1519] p-2 rounded-lg border border-[rgba(196,154,84,0.1)]">
                  <Loader2 className="h-3 w-3 animate-spin text-[#C49A54]" />
                  Cargando disponibilidad...
                </div>
              ) : availableTables.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 p-2 rounded-lg border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  No hay mesas disponibles en este momento para este aforo.
                </div>
              ) : (
                <Select value={selectedTableId} onValueChange={setSelectedTableId} required>
                  <SelectTrigger className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9">
                    <SelectValue placeholder="Selecciona mesa..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.2)] text-white">
                    {availableTables.map((table: any) => (
                      <SelectItem key={table.id} value={table.id.toString()} className="text-xs cursor-pointer focus:bg-[#0B1519] focus:text-[#C49A54]">
                        Mesa {table.number} ({table.zoneName}) - Capacidad {table.capacity} pax
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setIsAssignOpen(false)}
                className="bg-[#0B1519] border border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-9 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={assignTableMutation.isPending || !selectedTableId}
                className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-9 cursor-pointer"
              >
                {assignTableMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                ) : (
                  <Check className="h-3.5 w-3.5 mr-1" />
                )}
                Confirmar Asignación
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
