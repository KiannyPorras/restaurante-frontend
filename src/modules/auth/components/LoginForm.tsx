import { useForm } from '@tanstack/react-form'
import { useLogin } from '../hooks/useLogin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate({
        username: value.username,
        password: value.password,
      })
    },
  })

  return (
    <Card className="bg-[#101D1A] border border-[rgba(196,154,84,0.2)] w-full max-w-sm text-[#F2E9DB] shadow-2xl p-2">
      <CardHeader className="items-center space-y-3 pb-6 text-center">
        <div>
          <CardTitle className="font-bold text-[#C49A54] text-xl font-serif tracking-tight">
            Ingreso al Sistema
          </CardTitle>
          <CardDescription className="mt-1.5 text-[#9D9A91] text-xs">
            Digita tus credenciales para acceder al panel.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Manejo de Errores de API */}
        {loginMutation.isError && (
          <div className="flex items-start gap-2 bg-red-950/20 mb-4 p-3 border border-red-500/20 rounded-md text-red-200 text-xs">
            <AlertCircle className="mt-0.5 w-4 h-4 text-red-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-[#C49A54] text-[11px] uppercase tracking-wide">Error de inicio de sesión</p>
              <p className="mt-1 text-red-300/90">{loginMutation.error.message}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          {/* Campo: Usuario */}
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => !value ? 'El nombre de usuario es obligatorio' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-semibold text-[#C49A54] tracking-wide text-xs">
                  Usuario
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="admin"
                  className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] placeholder-[#9D9A91]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
                  disabled={loginMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="mt-1 font-medium text-[10px] text-red-400">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Campo: Contraseña */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => !value ? 'La contraseña es obligatoria' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-semibold text-[#C49A54] tracking-wide text-xs">
                  Contraseña
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] placeholder-[#9D9A91]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
                  disabled={loginMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="mt-1 font-medium text-[10px] text-red-400">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || loginMutation.isPending}
                className="mt-6 w-full cursor-pointer bg-[#C49A54] hover:bg-[#A98245] text-[#07110F] font-semibold transition-colors duration-200 border-none h-10 text-xs"
              >
                {loginMutation.isPending ? (
                  <div className="flex justify-center items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <span>Ingresar</span>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}
