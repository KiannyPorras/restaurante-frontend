import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pizza, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Navbar simple */}
      <header className="w-full border-b border-border bg-background">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Pizza className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              ChefStack
            </span>
          </div>

          <Link to="/dashboard">
            <Button size="sm" className="cursor-pointer">
              Iniciar Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 text-center max-w-4xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">
          ChefStack Admin Platform
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl">
          Administración de Restaurantes
        </h1>

        {/* Subhead */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Gestione menús, platos, comandas y capacidad operativa de forma centralizada con la suite integrada de TanStack.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2 w-full sm:w-auto">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer">
              Acceder al Panel
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer">
            Documentación
          </Button>
        </div>

        {/* Grid de Features (Estilo puro shadcn) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full">
          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="p-2.5 bg-muted text-muted-foreground rounded-lg mb-2">
                <Zap className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold">Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-normal">
              Estado de datos asíncronos y almacenamiento en caché optimizado.
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="p-2.5 bg-muted text-muted-foreground rounded-lg mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold">Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-normal">
              Manejo seguro de tokens JWT y guardias de autenticación estrictas.
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="p-2.5 bg-muted text-muted-foreground rounded-lg mb-2">
                <Heart className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold">Consistencia</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-normal">
              Componentes de interfaz planos, accesibles y estables en cualquier vista.
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} ChefStack. Construido con React 19 y la Suite de TanStack.</p>
        </div>
      </footer>
    </div>
  )
}
