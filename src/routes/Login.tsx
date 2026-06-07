import { LoginForm } from '@/modules/auth/components/LoginForm'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative px-6 py-12">
      
      {/* Botón flotante para regresar a la Landing */}
      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground h-8 text-xs">
            <ChevronLeft className="h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Contenedor del Formulario Centrado */}
      <div className="w-full flex justify-center py-4">
        <LoginForm />
      </div>

      {/* Marca de agua / Créditos */}
      <div className="absolute bottom-6 text-[10px] text-muted-foreground">
        ChefStack Admin Platform
      </div>
    </div>
  )
}
