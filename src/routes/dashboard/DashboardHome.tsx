import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  History,
  MoreHorizontal,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useReservationsQuery,
  useAttendReservationMutation,
  useCancelReservationMutation,
  useReservationHistoryQuery,
} from '@/modules/reservations/hooks/useReservations'

export function DashboardHome() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [historyReservationId, setHistoryReservationId] = useState<number | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Queries y mutations
  const { data: reservations = [], isLoading, isError } = useReservationsQuery(selectedDate)
  const { data: historyLogs = [], isLoading: isLoadingHistory } = useReservationHistoryQuery(
    historyReservationId ?? 0,
    isHistoryOpen
  )

  const attendMutation = useAttendReservationMutation()
  const cancelMutation = useCancelReservationMutation()

  // Acciones
  const handleAttend = async (id: number) => {
    try {
      await attendMutation.mutateAsync(id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleViewHistory = (id: number) => {
    setHistoryReservationId(id)
    setIsHistoryOpen(true)
  }

  // Cálculos de estadísticas
  const totalReservations = reservations.length
  const attendedCount = reservations.filter((r) => r.status === 'Atendido').length
  const pendingCount = reservations.filter((r) => r.status === 'Pendiente').length
  const cancelledCount = reservations.filter((r) => r.status === 'Cancelado').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto bg-[#0E1B21] text-white p-1 font-sans">
      
      {/* Cabecera del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(196,154,84,0.15)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-[#C49A54] font-display">Control de Reservaciones</h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Filtra por fecha, gestiona asistencias, cancelaciones y revisa bitácoras de cambios.
          </p>
        </div>

        {/* Filtro por fecha */}
        <div className="flex items-center gap-3 bg-[#112128] border border-[rgba(196,154,84,0.2)] p-2 rounded-lg shrink-0">
          <Label htmlFor="dateFilter" className="text-xs font-semibold text-[#C49A54] whitespace-nowrap">
            Filtrar Fecha:
          </Label>
          <Input
            id="dateFilter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-36 h-8 bg-[#0B1519] border-[rgba(196,154,84,0.15)] text-white text-xs"
          />
        </div>
      </div>

      {/* Grid de Métricas Reales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Reservas */}
        <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md hover:border-[#C49A54]/50 transition-all duration-300">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Total del día
              </span>
              <p className="text-2xl font-bold text-[#C49A54]">{totalReservations}</p>
              <p className="text-[9px] text-[#9CA3AF]">Reservaciones registradas</p>
            </div>
            <div className="p-3 bg-[#0B1519] rounded-full text-[#C49A54] border border-[rgba(196,154,84,0.1)]">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md hover:border-[#C49A54]/50 transition-all duration-300">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Pendientes
              </span>
              <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
              <p className="text-[9px] text-[#9CA3AF]">En espera de llegada</p>
            </div>
            <div className="p-3 bg-[#0B1519] rounded-full text-amber-400 border border-[rgba(196,154,84,0.1)]">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Atendidos */}
        <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md hover:border-[#C49A54]/50 transition-all duration-300">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Atendidos
              </span>
              <p className="text-2xl font-bold text-emerald-400">{attendedCount}</p>
              <p className="text-[9px] text-[#9CA3AF]">Llegada confirmada</p>
            </div>
            <div className="p-3 bg-[#0B1519] rounded-full text-emerald-400 border border-[rgba(196,154,84,0.1)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Cancelados */}
        <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md hover:border-[#C49A54]/50 transition-all duration-300">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Cancelados
              </span>
              <p className="text-2xl font-bold text-red-400">{cancelledCount}</p>
              <p className="text-[9px] text-[#9CA3AF]">Reservaciones canceladas</p>
            </div>
            <div className="p-3 bg-[#0B1519] rounded-full text-red-400 border border-[rgba(196,154,84,0.1)]">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenedor de la Tabla Principal */}
      <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-bold text-[#C49A54]">Listado de Reservaciones</CardTitle>
          <CardDescription className="text-xs text-[#9CA3AF]">
            Reservaciones activas programadas para el {selectedDate}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#C49A54] border-t-transparent" />
              <p className="text-xs text-[#9CA3AF]">Cargando reservaciones del día...</p>
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-xs text-red-400">
              Ocurrió un error al cargar las reservaciones. Intente de nuevo más tarde.
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Calendar className="mx-auto h-8 w-8 text-[#C49A54]/50" />
              <h3 className="text-sm font-semibold text-[#C49A54]">Sin Reservas Registradas</h3>
              <p className="text-xs text-[#9CA3AF] max-w-xs mx-auto">
                No hay reservaciones de clientes agendadas para el {selectedDate}.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-[rgba(196,154,84,0.15)] overflow-hidden bg-[#0E1B21]">
              <Table>
                <TableHeader className="bg-[#0B1519]">
                  <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Cliente</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Teléfono</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Mesa</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Zona</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Hora</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Pax</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Estado</TableHead>
                    <TableHead className="text-right text-[#9CA3AF] text-xs font-semibold pr-6 border-none">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((res) => (
                    <TableRow
                      key={res.id}
                      className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150"
                    >
                      <TableCell className="text-xs font-semibold text-white border-none">
                        {res.clientName} {res.clientLastName}
                      </TableCell>
                      <TableCell className="text-xs text-[#9CA3AF] border-none font-mono">
                        {res.clientPhone}
                      </TableCell>
                      <TableCell className="text-xs text-[#C49A54] font-semibold border-none">
                        Mesa {res.tableNumber}
                      </TableCell>
                      <TableCell className="text-xs text-white/80 border-none">
                        {res.zoneName}
                      </TableCell>
                      <TableCell className="text-xs text-white border-none font-mono">
                        {res.reservationTime.slice(0, 5)}
                      </TableCell>
                      <TableCell className="text-xs text-white border-none font-semibold">
                        {res.guestCount}
                      </TableCell>
                      <TableCell className="border-none">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            res.status === 'Atendido'
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                              : res.status === 'Cancelado'
                              ? 'bg-red-950/20 text-red-400 border-red-500/20'
                              : 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              res.status === 'Atendido'
                                ? 'bg-emerald-400'
                                : res.status === 'Cancelado'
                                ? 'bg-red-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          {res.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 border-none">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#9CA3AF] hover:text-[#C49A54] hover:bg-[#0B1519] cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#112128] border border-[rgba(196,154,84,0.2)] text-white w-44">
                            <DropdownMenuLabel className="text-[10px] font-semibold text-[#9CA3AF] px-2 py-1.5 select-none">
                              Acciones de Reserva
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                            
                            {res.status === 'Pendiente' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleAttend(res.id)}
                                  disabled={attendMutation.isPending}
                                  className="cursor-pointer text-xs focus:bg-[#0B1519] focus:text-[#C49A54]"
                                >
                                  <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                                  Registrar Llegada
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCancel(res.id)}
                                  disabled={cancelMutation.isPending}
                                  className="cursor-pointer text-xs text-red-400 focus:text-red-300 focus:bg-red-950/20"
                                >
                                  <XCircle className="mr-2 h-3.5 w-3.5 text-red-500" />
                                  Cancelar Reserva
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[rgba(196,154,84,0.15)]" />
                              </>
                            )}

                            <DropdownMenuItem
                              onClick={() => handleViewHistory(res.id)}
                              className="cursor-pointer text-xs focus:bg-[#0B1519] focus:text-[#C49A54]"
                            >
                              <History className="mr-2 h-3.5 w-3.5 text-[#C49A54]" />
                              Ver Historial (Logs)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIÁLOGO HISTORIAL / BITÁCORA */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-md bg-[#112128] border border-[rgba(196,154,84,0.2)] text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-[#C49A54] font-display text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Bitácora de Cambios
            </DialogTitle>
            <DialogDescription className="text-xs text-[#9CA3AF]">
              Historial detallado de estados y modificaciones para esta reserva.
            </DialogDescription>
          </DialogHeader>

          {isLoadingHistory ? (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#C49A54]" />
              <p className="text-xs text-[#9CA3AF]">Cargando logs...</p>
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9CA3AF]">
              No hay registros de cambios para esta reservación.
            </div>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-1 mt-4">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#0B1519] border border-[rgba(196,154,84,0.1)] rounded-lg p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-[#C49A54]">Estado: {log.status}</span>
                    <span className="text-[#9CA3AF] font-mono">
                      {new Date(log.changeDate).toLocaleString('es-ES')}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsHistoryOpen(false)}
              className="bg-[#0B1519] border border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-9 cursor-pointer"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
