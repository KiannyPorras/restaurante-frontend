import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react'

export function DashboardHome() {
  const stats = [
    {
      title: 'Ventas del Día',
      value: '$1,280.50',
      description: '+12% comparado con ayer',
      icon: TrendingUp,
    },
    {
      title: 'Nuevos Clientes',
      value: '48',
      description: '+4 nuevos esta hora',
      icon: Users,
    },
    {
      title: 'Órdenes Activas',
      value: '14',
      description: '6 en preparación, 8 listas',
      icon: ShoppingBag,
    },
    {
      title: 'Tiempo Promedio',
      value: '22 min',
      description: '-3 min que el promedio semanal',
      icon: Clock,
    },
  ]

  const recentOrders = [
    {
      id: '#ORD-3102',
      customer: 'Alejandro Gómez',
      items: '2x Lomo Saltado, 1x Chicha Morada',
      status: 'En preparación',
      statusColor: 'text-amber-300 bg-amber-950/40 border-amber-900/40',
      total: '$39.00',
    },
    {
      id: '#ORD-3101',
      customer: 'Beatriz Mendoza',
      items: '1x Ceviche Mixto, 1x Pisco Sour',
      status: 'Entregado',
      statusColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-900/40',
      total: '$26.50',
    },
    {
      id: '#ORD-3100',
      customer: 'Carlos Ruiz',
      items: '3x Tacu Tacu, 2x Suspiro a la Limeña',
      status: 'Completado',
      statusColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-900/40',
      total: '$58.00',
    },
    {
      id: '#ORD-3099',
      customer: 'Diana Flores',
      items: '1x Ají de Gallina, 1x Agua Mineral',
      status: 'Entregado',
      statusColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-900/40',
      total: '$17.50',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto bg-[#0E1B21] text-white p-1">
      {/* Cabecera del Dashboard */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-[#C49A54] font-display">Resumen Operativo</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Métricas clave y estado de la cocina en tiempo real.
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md hover:border-[#C49A54]/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <Icon className="h-4 w-4 text-[#C49A54]" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-2xl font-bold tracking-tight text-[#C49A54]">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Grid de Secciones Secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabla de Ordenes Recientes */}
        <Card className="lg:col-span-2 border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Últimas Órdenes</CardTitle>
            <CardDescription className="text-xs text-[#9CA3AF]">Lista de pedidos procesados y en cola.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-[rgba(196,154,84,0.15)] overflow-hidden bg-[#0E1B21]">
              <Table>
                <TableHeader className="bg-[#0B1519]">
                  <TableRow className="border-b border-[rgba(196,154,84,0.15)] hover:bg-[#0B1519]">
                    <TableHead className="w-[100px] text-[#9CA3AF] text-xs font-semibold border-none">Pedido</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Cliente</TableHead>
                    <TableHead className="hidden md:table-cell text-[#9CA3AF] text-xs font-semibold border-none">Platos</TableHead>
                    <TableHead className="text-[#9CA3AF] text-xs font-semibold border-none">Estado</TableHead>
                    <TableHead className="text-right text-[#9CA3AF] text-xs font-semibold border-none">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#0B1519]/40 border-b border-[rgba(196,154,84,0.08)] transition-colors duration-150">
                      <TableCell className="font-mono text-xs font-semibold text-[#C49A54] border-none">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-white border-none">
                        {order.customer}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-[#9CA3AF] border-none">
                        {order.items}
                      </TableCell>
                      <TableCell className="border-none">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-[#C49A54] border-none">
                        {order.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Estado Operativo de la Cocina */}
        <Card className="border border-[rgba(196,154,84,0.20)] bg-[#112128] text-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Estado de Cocina</CardTitle>
            <CardDescription className="text-xs text-[#9CA3AF]">Capacidad y asignación de mesas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Barra de progreso 1: Mesas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Ocupación de Salón</span>
                <span className="text-white">18 / 24 mesas (75%)</span>
              </div>
              <div className="h-1.5 w-full bg-[#0B1519] rounded-full overflow-hidden border border-[rgba(196,154,84,0.1)]">
                <div className="h-full bg-[#C49A54] rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Barra de progreso 2: Capacidad Cocina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Capacidad de Cocina</span>
                <span className="text-white">Media (45%)</span>
              </div>
              <div className="h-1.5 w-full bg-[#0B1519] rounded-full overflow-hidden border border-[rgba(196,154,84,0.1)]">
                <div className="h-full bg-[#C49A54] rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Historial rápido */}
            <div className="pt-4 border-t border-[rgba(196,154,84,0.15)] space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-[#C49A54] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Mesa 4 liberada</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-[#C49A54] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Pedido #ORD-3101 entregado</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">Hace 12 minutos</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
