import { useForm } from '@tanstack/react-form'
import { useCreateTurnMutation } from '../hooks/useTurns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Loader2 } from 'lucide-react'

interface CreateTurnSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTurnSheet({ isOpen, onOpenChange }: CreateTurnSheetProps) {
  const createMutation = useCreateTurnMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      startTime: '12:00',
      endTime: '16:00',
    },
    onSubmit: async ({ value }) => {
      // Formatear a formato HH:MM:00 requerido por TimeSpan
      const formattedStart = value.startTime.includes(':') && value.startTime.split(':').length === 2 
        ? `${value.startTime}:00` 
        : value.startTime
      const formattedEnd = value.endTime.includes(':') && value.endTime.split(':').length === 2 
        ? `${value.endTime}:00` 
        : value.endTime

      try {
        await createMutation.mutateAsync({
          name: value.name,
          startTime: formattedStart,
          endTime: formattedEnd,
        })
        form.reset()
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card">
        <SheetHeader className="pb-6">
          <SheetTitle>Nuevo Turno</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Define los horarios de servicio y el nombre del turno.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {/* Campo: Nombre */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'El nombre es obligatorio'
                  : value.trim().length === 0
                  ? 'No puede estar vacío'
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Nombre del Turno
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Almuerzo, Cena VIP"
                  className="bg-background"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-destructive font-medium">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Campo: Hora de Inicio */}
          <form.Field
            name="startTime"
            validators={{
              onChange: ({ value }) => !value ? 'La hora de inicio es obligatoria' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Hora de Inicio (Entrada)
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-background"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-destructive font-medium">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Campo: Hora de Cierre */}
          <form.Field
            name="endTime"
            validators={{
              onChange: ({ value }) => !value ? 'La hora de cierre es obligatoria' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Hora de Cierre (Corte)
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-background"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-destructive font-medium">
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
                disabled={!canSubmit || isSubmitting || createMutation.isPending}
                className="w-full mt-6"
              >
                {createMutation.isPending ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <span>Guardar Turno</span>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  )
}
