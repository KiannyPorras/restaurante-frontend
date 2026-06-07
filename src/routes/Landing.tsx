import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Pizza, Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col justify-between selection:bg-amber-550 selection:text-white">
      {/* Navbar simple de la Landing */}
      <header className="w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-orange-500 text-white rounded-xl shadow-md shadow-amber-500/20">
              <Pizza className="h-5 w-5 animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              ChefStack
            </span>
          </div>

          <Link to="/dashboard">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-sm shadow-amber-600/10 cursor-pointer">
              Iniciar Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 text-center max-w-5xl mx-auto space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-sm border border-amber-200 dark:border-amber-900/50 animate-bounce">
          <Sparkles className="h-3.5 w-3.5" />
          ¡Nuevo lanzamiento de ChefStack!
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
          Administra tu restaurante con{' '}
          <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            Estilo e Inteligencia
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-zinc-550 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          La plataforma definitiva para gestionar menús, platos, comandas y la experiencia de tu cocina. Integrado con lo último en React 19 y Tailwind CSS v4.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-600/20 px-8 flex items-center justify-center gap-2 cursor-pointer">
              Acceder al Panel
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 px-8 cursor-pointer">
            Conocer Más
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Velocidad Extrema</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-normal">
              Procesamiento de datos instantáneo con TanStack Query y almacenamiento en caché.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Control Absoluto</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-normal">
              Formularios con validaciones tipadas robustas y gestión de tablas dinámicas.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Estética Premium</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-normal">
              Diseñado con shadcn/ui para una experiencia de usuario deslumbrante y fluida.
            </p>
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="w-full border-t border-zinc-200/50 dark:border-zinc-800/50 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} ChefStack Inc. Configurado con React 19 y la Suite de TanStack.</p>
        </div>
      </footer>
    </div>
  )
}
