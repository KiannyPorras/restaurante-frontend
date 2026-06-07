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
      statusColor: 'text-foreground bg-muted border-border',
      total: '$39.00',
    },
    {
      id: '#ORD-3101',
      customer: 'Beatriz Mendoza',
      items: '1x Ceviche Mixto, 1x Pisco Sour',
      status: 'Entregado',
      statusColor: 'text-foreground bg-muted border-border',
      total: '$26.50',
    },
    {
      id: '#ORD-3100',
      customer: 'Carlos Ruiz',
      items: '3x Tacu Tacu, 2x Suspiro a la Limeña',
      status: 'Completado',
      statusColor: 'text-foreground bg-muted border-border',
      total: '$58.00',
    },
    {
      id: '#ORD-3099',
      customer: 'Diana Flores',
      items: '1x Ají de Gallina, 1x Agua Mineral',
      status: 'Entregado',
      statusColor: 'text-foreground bg-muted border-border',
      total: '$17.50',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera del Dashboard */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Resumen Operativo</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Métricas clave y estado de la cocina en tiempo real.
        </p>
      </div>

      {/* Grid de Métricas (Estilo puro shadcn) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
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
        <Card className="lg:col-span-2 border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Últimas Órdenes</CardTitle>
            <CardDescription className="text-xs">Lista de pedidos procesados y en cola.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
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
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {order.customer}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {order.items}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
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
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Estado de Cocina</CardTitle>
            <CardDescription className="text-xs">Capacidad y asignación de mesas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Barra de progreso 1: Mesas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Ocupación de Salón</span>
                <span className="text-foreground">18 / 24 mesas (75%)</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Barra de progreso 2: Capacidad Cocina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Capacidad de Cocina</span>
                <span className="text-foreground">Media (45%)</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Historial rápido */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Mesa 4 liberada</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-xs">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Pedido #ORD-3101 entregado</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Hace 12 minutos</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
