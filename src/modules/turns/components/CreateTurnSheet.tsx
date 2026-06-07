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
      startTime: '08:00',
      endTime: '16:00',
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          name: value.name,
          startTime: value.startTime,
          endTime: value.endTime,
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
      <SheetContent className="sm:max-w-md bg-[#112128] border-l border-[rgba(196,154,84,0.2)] text-[#FFFFFF]">
        <SheetHeader className="pb-6 border-b border-[rgba(196,154,84,0.1)]">
          <SheetTitle className="text-[#C49A54] font-display text-lg">Nuevo Turno</SheetTitle>
          <SheetDescription className="text-xs text-[#9D9A91]">
            Configura el horario del nuevo turno de servicio del restaurante.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6 mt-6"
        >
          {/* Campo: Nombre */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'El nombre es obligatorio'
                  : value.length < 3
                  ? 'Debe tener al menos 3 caracteres'
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                  Nombre del Turno
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Almuerzo Ejecutivo"
                  className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] placeholder-[#9D9A91]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-red-400 font-medium">
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
              onChange: ({ value }) => (!value ? 'La hora de inicio es obligatoria' : undefined),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                  Hora de Inicio
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs cursor-pointer block w-full"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-red-400 font-medium">
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
              onChange: ({ value }) => (!value ? 'La hora de cierre es obligatoria' : undefined),
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                  Hora de Cierre
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="time"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs cursor-pointer block w-full"
                  disabled={createMutation.isPending}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[10px] text-red-400 font-medium">
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
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    onOpenChange(false)
                  }}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] hover:bg-[#112128] hover:text-[#C49A54] text-xs h-10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createMutation.isPending}
                  className="flex-1 bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold transition-colors duration-200 border-none text-xs h-10"
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <span>Guardar</span>
                  )}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  )
}
