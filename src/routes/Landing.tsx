import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pizza,
  Calendar,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  Armchair,
  ChevronLeft,
  Map,
  List,
} from 'lucide-react'
import {
  useAvailableTablesQuery,
  useCreateClientMutation,
  useCreateReservationMutation
} from '@/modules/reservations/hooks/useReservations'
import { useCreateWaitingListMutation } from '@/modules/waitingList/hooks/useWaitingList'
import { useAllZonesQuery } from '@/modules/zones/hooks/useZones'
import { PublicTableMap } from '@/modules/tables/components/PublicTableMap'

export function Landing() {
  const [step, setStep] = useState<'search' | 'select' | 'client' | 'success' | 'waitlist' | 'waitlist-success'>('search')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('12:00')
  const [capacity, setCapacity] = useState('2')
  const [searchEnabled, setSearchEnabled] = useState(false)

  // Step 2: Selección
  const [selectedTable, setSelectedTable] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  // Step 3: Cliente
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  // Lista de espera
  const [preferZone, setPreferZone] = useState('')

  // Queries y mutations
  const { data: availableTables = [], isLoading: isLoadingAvailable, isError, error } = useAvailableTablesQuery(
    date,
    time + ':00',
    Number(capacity),
    searchEnabled
  )

  const { data: zones = [] } = useAllZonesQuery()

  const createClientMutation = useCreateClientMutation()
  const createReservationMutation = useCreateReservationMutation()
  const createWaitingListMutation = useCreateWaitingListMutation()

  // Buscar Disponibilidad
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchEnabled(true)
    setStep('select')
  }

  // Confirmar Selección de Mesa
  const handleSelectTable = (table: any) => {
    setSelectedTable(table)
    setStep('client')
  }

  // Registrar Cliente y Confirmar Reserva
  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !lastName || !phone || !selectedTable) return

    try {
      // 1. Registrar Cliente
      const client = await createClientMutation.mutateAsync({
        name,
        lastName,
        phone,
      })

      // 2. Crear Reserva
      await createReservationMutation.mutateAsync({
        clientId: client.id,
        tableId: selectedTable.id,
        date,
        reservationTime: time + ':00',
        guestCount: Number(capacity),
      })

      setStep('success')
    } catch (err) {
      console.error(err)
    }
  }

  // Unirse a la Lista de Espera
  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !lastName || !phone || !preferZone) return

    try {
      // 1. Registrar Cliente
      const client = await createClientMutation.mutateAsync({
        name,
        lastName,
        phone,
      })

      // 2. Unirse a la Lista de Espera
      await createWaitingListMutation.mutateAsync({
        clientId: client.id,
        desiredDay: date,
        desiredTime: time + ':00',
        guestCount: Number(capacity),
        preferZone,
      })

      setStep('waitlist-success')
    } catch (err) {
      console.error(err)
    }
  }

  // Volver a iniciar
  const resetForm = () => {
    setStep('search')
    setSearchEnabled(false)
    setSelectedTable(null)
    setViewMode('map')
    setName('')
    setLastName('')
    setPhone('')
    setPreferZone('')
  }

  return (
    <div className="min-h-screen bg-[#0E1B21] text-white flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="w-full border-b border-[rgba(196,154,84,0.15)] bg-[#0B1519]">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C49A54] text-[#0E1B21] rounded-lg">
              <Pizza className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white font-display">
              ChefStack
            </span>
          </div>

          <Link to="/dashboard">
            <Button size="sm" className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold cursor-pointer">
              Área de Staff
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Reservation Wizard */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 max-w-4xl mx-auto w-full">
        
        {/* Stepper Indicators */}
        {step !== 'success' && step !== 'waitlist-success' && (
          <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
            <span className={step === 'search' ? 'text-[#C49A54]' : ''}>1. Buscar</span>
            <span>/</span>
            <span className={step === 'select' || step === 'waitlist' ? 'text-[#C49A54]' : ''}>2. Disponibilidad</span>
            <span>/</span>
            <span className={step === 'client' ? 'text-[#C49A54]' : ''}>3. Datos Personales</span>
          </div>
        )}

        <div className={`w-full transition-all duration-300 ${step === 'select' && viewMode === 'map' && availableTables.length > 0 ? 'max-w-3xl' : 'max-w-xl'}`}>
          
          {/* STEP 1: BUSCADOR DE DISPONIBILIDAD */}
          {step === 'search' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto p-2 bg-[#0B1519] rounded-full w-fit border border-[rgba(196,154,84,0.15)]">
                  <Sparkles className="h-6 w-6 text-[#C49A54]" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Reserva tu Mesa</CardTitle>
                <CardDescription className="text-xs text-[#9CA3AF]">
                  Elige la fecha, la hora y el número de invitados para encontrar tu mesa perfecta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-xs font-semibold text-[#C49A54]">Fecha</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#C49A54]" />
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => {
                            setDate(e.target.value)
                            setSearchEnabled(false)
                          }}
                          required
                          className="pl-9 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="time" className="text-xs font-semibold text-[#C49A54]">Hora de llegada</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-[#C49A54]" />
                        <Input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => {
                            setTime(e.target.value)
                            setSearchEnabled(false)
                          }}
                          required
                          className="pl-9 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="capacity" className="text-xs font-semibold text-[#C49A54]">Invitados</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-[#C49A54]" />
                      <Select value={capacity} onValueChange={(val) => {
                        setCapacity(val)
                        setSearchEnabled(false)
                      }}>
                        <SelectTrigger className="pl-9 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9">
                          <SelectValue placeholder="Personas..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.2)] text-white">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-xs cursor-pointer focus:bg-[#0B1519] focus:text-[#C49A54]">
                              {num} {num === 1 ? 'Persona' : 'Personas'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-10 mt-2 cursor-pointer">
                    Buscar Disponibilidad
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: MOSTRAR MESAS DISPONIBLES O FALLBACK LISTA DE ESPERA */}
          {step === 'select' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(196,154,84,0.1)]">
                <div className="flex items-center gap-3">
                  <Button type="button" variant="ghost" size="icon" onClick={() => setStep('search')} className="h-8 w-8 text-[#C49A54] hover:bg-[#0B1519]">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-lg font-bold text-[#C49A54] font-display">Mesas Disponibles</CardTitle>
                    <CardDescription className="text-xs text-[#9CA3AF]">
                      Búsqueda para {capacity} personas el {date} a las {time}
                    </CardDescription>
                  </div>
                </div>

                {/* Alternador de Vista Mapa / Lista */}
                {availableTables.length > 0 && (
                  <div className="flex bg-[#0B1519] p-1 rounded-lg border border-[rgba(196,154,84,0.15)] self-end sm:self-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('map')}
                      className={`px-3 py-1.5 text-xs font-semibold h-7 cursor-pointer gap-1 flex items-center ${
                        viewMode === 'map'
                          ? 'bg-[#C49A54] text-[#0E1B21] hover:bg-[#C49A54] hover:text-[#0E1B21] font-bold shadow'
                          : 'text-white hover:text-[#C49A54] hover:bg-[#112128]'
                      }`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      Croquis
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1.5 text-xs font-semibold h-7 cursor-pointer gap-1 flex items-center ${
                        viewMode === 'list'
                          ? 'bg-[#C49A54] text-[#0E1B21] hover:bg-[#C49A54] hover:text-[#0E1B21] font-bold shadow'
                          : 'text-white hover:text-[#C49A54] hover:bg-[#112128]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      Lista
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {isLoadingAvailable ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#C49A54] border-t-transparent" />
                    <p className="text-xs text-[#9CA3AF]">Buscando mesas en tiempo real...</p>
                  </div>
                ) : isError ? (
                  <div className="py-8 text-center text-xs text-red-400">
                    {error && (error as any).response?.data?.message
                      ? (error as any).response.data.message
                      : typeof (error as any).response?.data === 'string'
                      ? (error as any).response.data
                      : 'Ocurrió un error al consultar la disponibilidad. Por favor intente de nuevo.'}
                  </div>
                ) : availableTables.length === 0 ? (
                  <div className="py-6 text-center space-y-4">
                    <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
                      ¡Vaya! No quedan mesas libres para este aforo en el horario seleccionado. Te invitamos a anotarte en nuestra lista de espera para asignarte una mesa en caso de cancelaciones.
                    </p>
                    <Button
                      onClick={() => setStep('waitlist')}
                      className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-9 cursor-pointer"
                    >
                      Unirse a la Lista de Espera
                    </Button>
                  </div>
                ) : viewMode === 'map' ? (
                  <PublicTableMap
                    availableTables={availableTables}
                    selectedTable={selectedTable}
                    onSelectTable={handleSelectTable}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
                    {availableTables.map((table: any) => (
                      <div
                        key={table.id}
                        onClick={() => handleSelectTable(table)}
                        className="bg-[#0B1519] border border-[rgba(196,154,84,0.15)] rounded-lg p-3 hover:border-[#C49A54] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#112128] rounded-full text-[#C49A54]">
                            <Armchair className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">Mesa {table.number}</p>
                            <p className="text-[10px] text-[#9CA3AF]">Aforo: {table.capacity} personas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-[#112128] border border-[rgba(196,154,84,0.1)] text-[#C49A54] px-2 py-0.5 rounded-full font-semibold">
                            {table.zoneName}
                          </span>
                          <span className="block text-[8px] text-white/50 group-hover:text-[#C49A54] mt-1 transition-colors">
                            Reservar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* STEP 3: REGISTRO DE DATOS DEL CLIENTE */}
          {step === 'client' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-[rgba(196,154,84,0.1)]">
                <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="h-8 w-8 text-[#C49A54] hover:bg-[#0B1519]">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-lg font-bold text-[#C49A54] font-display">Tus Datos Personales</CardTitle>
                  <CardDescription className="text-xs text-[#9CA3AF]">
                    Ingresa tus detalles para asegurar la Mesa {selectedTable?.number}.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-[#C49A54]">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Tu nombre"
                        className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-[#C49A54]">Apellidos</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Tus apellidos"
                        className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-[#C49A54]">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Ej. +506 8888 8888"
                      className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createClientMutation.isPending || createReservationMutation.isPending}
                    className="w-full bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-10 mt-2 cursor-pointer"
                  >
                    {(createClientMutation.isPending || createReservationMutation.isPending)
                      ? 'Confirmando Reserva...'
                      : 'Confirmar Reservación'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: FORMULARIO LISTA DE ESPERA */}
          {step === 'waitlist' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl">
              <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-[rgba(196,154,84,0.1)]">
                <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="h-8 w-8 text-[#C49A54] hover:bg-[#0B1519]">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-lg font-bold text-[#C49A54] font-display">Unirse a la Lista de Espera</CardTitle>
                  <CardDescription className="text-xs text-[#9CA3AF]">
                    Ingresa tus datos y tu zona de preferencia para la cola.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleJoinWaitlist} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="wname" className="text-xs font-semibold text-[#C49A54]">Nombre</Label>
                      <Input
                        id="wname"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Tu nombre"
                        className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="wlastName" className="text-xs font-semibold text-[#C49A54]">Apellidos</Label>
                      <Input
                        id="wlastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Tus apellidos"
                        className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="wphone" className="text-xs font-semibold text-[#C49A54]">Teléfono</Label>
                      <Input
                        id="wphone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Ej. +506 8888 8888"
                        className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="wzone" className="text-xs font-semibold text-[#C49A54]">Zona Preferida</Label>
                      <Select value={preferZone} onValueChange={setPreferZone}>
                        <SelectTrigger className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white text-xs h-9">
                          <SelectValue placeholder="Elige zona..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#112128] border-[rgba(196,154,84,0.2)] text-white">
                          {zones.map((zone: any) => (
                            <SelectItem key={zone.id} value={zone.name} className="text-xs cursor-pointer focus:bg-[#0B1519] focus:text-[#C49A54]">
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createClientMutation.isPending || createWaitingListMutation.isPending}
                    className="w-full bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-10 mt-2 cursor-pointer"
                  >
                    {(createClientMutation.isPending || createWaitingListMutation.isPending)
                      ? 'Registrando...'
                      : 'Unirse a la Cola de Espera'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: SUCCESS RESERVA */}
          {step === 'success' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl text-center">
              <CardContent className="p-8 space-y-5">
                <div className="mx-auto p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-full w-fit">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">¡Reserva Confirmada!</h2>
                  <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
                    Hemos agendado tu reserva con éxito. Te esperamos en el salón para brindarte una gran experiencia.
                  </p>
                </div>
                <div className="bg-[#0B1519] border border-[rgba(196,154,84,0.1)] rounded-lg p-4 space-y-2 text-xs text-left max-w-xs mx-auto">
                  <p><strong className="text-[#C49A54]">Cliente:</strong> {name} {lastName}</p>
                  <p><strong className="text-[#C49A54]">Mesa:</strong> Mesa {selectedTable?.number} ({selectedTable?.zoneName})</p>
                  <p><strong className="text-[#C49A54]">Fecha:</strong> {date}</p>
                  <p><strong className="text-[#C49A54]">Hora:</strong> {time}</p>
                </div>
                <Button onClick={resetForm} className="w-full sm:w-48 bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-9 mt-2 cursor-pointer">
                  Hacer Otra Reserva
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 6: SUCCESS LISTA DE ESPERA */}
          {step === 'waitlist-success' && (
            <Card className="border border-[rgba(196,154,84,0.2)] bg-[#112128] text-white shadow-xl text-center">
              <CardContent className="p-8 space-y-5">
                <div className="mx-auto p-3 bg-amber-950/20 text-amber-400 border border-amber-500/20 rounded-full w-fit">
                  <Clock className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-[#C49A54] font-display">Registrado en Espera</h2>
                  <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
                    Te has unido con éxito a nuestra lista de espera. Si alguna mesa se libera, nuestro personal te contactará de inmediato.
                  </p>
                </div>
                <div className="bg-[#0B1519] border border-[rgba(196,154,84,0.1)] rounded-lg p-4 space-y-2 text-xs text-left max-w-xs mx-auto">
                  <p><strong className="text-[#C49A54]">Nombre:</strong> {name} {lastName}</p>
                  <p><strong className="text-[#C49A54]">Zona Preferida:</strong> {preferZone}</p>
                  <p><strong className="text-[#C49A54]">Aforo:</strong> {capacity} personas</p>
                  <p><strong className="text-[#C49A54]">Día Solicitado:</strong> {date}</p>
                </div>
                <Button onClick={resetForm} className="w-full sm:w-48 bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-bold h-9 mt-2 cursor-pointer">
                  Volver al Inicio
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[rgba(196,154,84,0.15)] py-6 text-center text-xs text-[#9CA3AF] bg-[#0B1519]">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} ChefStack. Reservas y disponibilidad al instante.</p>
        </div>
      </footer>
    </div>
  )
}
