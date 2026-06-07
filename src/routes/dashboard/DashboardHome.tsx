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
  // Datos mock para KPIs del restaurante
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

  // Órdenes recientes de relleno
  const recentOrders = [
    {
      id: '#ORD-3102',
      customer: 'Alejandro Gómez',
      items: '2x Lomo Saltado, 1x Chicha Morada',
      status: 'En preparación',
      statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50',
      total: '$39.00',
    },
    {
      id: '#ORD-3101',
      customer: 'Beatriz Mendoza',
      items: '1x Ceviche Mixto, 1x Pisco Sour',
      status: 'Entregado',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50',
      total: '$26.50',
    },
    {
      id: '#ORD-3100',
      customer: 'Carlos Ruiz',
      items: '3x Tacu Tacu, 2x Suspiro a la Limeña',
      status: 'Completado',
      statusColor: 'text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-700/50',
      total: '$58.00',
    },
    {
      id: '#ORD-3099',
      customer: 'Diana Flores',
      items: '1x Ají de Gallina, 1x Agua Mineral',
      status: 'Entregado',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50',
      total: '$17.50',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera del Dashboard */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Resumen Operativo</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Métricas clave y estado de la cocina en tiempo real.
        </p>
      </div>

      {/* Grid de Métricas (KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <Icon className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-105">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
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
        
        {/* Tabla de Ordenes Recientes (2/3 de ancho en pantallas grandes) */}
        <Card className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Últimas Órdenes</CardTitle>
            <CardDescription>Lista de pedidos procesados y en cola.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-950">
                  <TableRow>
                    <TableHead className="w-[100px]">Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Platos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <TableCell className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {order.customer}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-zinc-500 dark:text-zinc-400">
                        {order.items}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {order.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Estado Operativo de la Cocina (1/3 de ancho) */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Estado de Cocina</CardTitle>
            <CardDescription>Capacidad y asignación de mesas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Barra de progreso 1: Mesas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500">Ocupación de Salón</span>
                <span className="text-zinc-900 dark:text-zinc-100">18 / 24 mesas (75%)</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Barra de progreso 2: Capacidad Cocina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500">Capacidad de Cocina</span>
                <span className="text-zinc-900 dark:text-zinc-100">Media</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Historial rápido / Notificaciones operativas */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Mesa 4 liberada</p>
                  <p className="text-zinc-500 mt-0.5">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Pedido #ORD-3101 entregado</p>
                  <p className="text-zinc-500 mt-0.5">Hace 12 minutos</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
