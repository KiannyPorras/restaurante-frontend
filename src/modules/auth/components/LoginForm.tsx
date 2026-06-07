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
    <Card className="bg-card border border-border w-full max-w-sm">
      <CardHeader className="items-center space-y-3 pb-6 text-center">
        <div>
          <CardTitle className="font-bold text-foreground text-xl tracking-tight">
            Ingreso al Sistema
          </CardTitle>
          <CardDescription className="mt-1 text-muted-foreground text-xs">
            Digita tus credenciales para acceder al panel.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Manejo de Errores de API */}
        {loginMutation.isError && (
          <div className="flex items-start gap-2 bg-destructive/10 mb-4 p-3 border border-destructive/20 rounded-md text-destructive text-xs">
            <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Error de inicio de sesión</p>
              <p className="mt-0.5">{loginMutation.error.message}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Campo: Usuario */}
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => !value ? 'El nombre de usuario es obligatorio' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="font-medium text-foreground text-xs">
                  Usuario
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="admin"
                  className="bg-background"
                  disabled={loginMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="mt-1 font-medium text-[10px] text-destructive">
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
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="font-medium text-foreground text-xs">
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
                  className="bg-background"
                  disabled={loginMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="mt-1 font-medium text-[10px] text-destructive">
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
                className="mt-4 w-full cursor-pointer"
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
