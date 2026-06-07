import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useUpdateTurnMutation } from '../hooks/useTurns'
import type { TurnResponse } from '../models/turnModels'
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

interface EditTurnSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  turn: TurnResponse | null
}

// Utilidad local para pasar del formato TimeSpan (ej. "08:00:00") a input time (ej. "08:00")
function convertToInputTime(time: string | undefined): string {
  if (!time) return '08:00'
  const parts = time.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return time
}

export function EditTurnSheet({ isOpen, onOpenChange, turn }: EditTurnSheetProps) {
  const updateMutation = useUpdateTurnMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      startTime: '',
      endTime: '',
    },
    onSubmit: async ({ value }) => {
      if (!turn) return
      try {
        await updateMutation.mutateAsync({
          id: turn.id,
          turn: {
            name: value.name,
            startTime: value.startTime,
            endTime: value.endTime,
          },
        })
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Sincronizar campos al cargar item a editar
  useEffect(() => {
    if (turn && isOpen) {
      form.setFieldValue('name', turn.name)
      form.setFieldValue('startTime', convertToInputTime(turn.startTime))
      form.setFieldValue('endTime', convertToInputTime(turn.endTime))
    }
  }, [turn, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-[#101D1A] border-l border-[rgba(196,154,84,0.2)] text-[#F2E9DB]">
        <SheetHeader className="pb-6 border-b border-[rgba(196,154,84,0.1)]">
          <SheetTitle className="text-[#C49A54] font-serif text-lg">Editar Turno</SheetTitle>
          <SheetDescription className="text-xs text-[#9D9A91]">
            Modifica los datos del turno de servicio del restaurante.
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
                  className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] placeholder-[#9D9A91]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
                  disabled={updateMutation.isPending}
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
                  className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs cursor-pointer block w-full"
                  disabled={updateMutation.isPending}
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
                  className="bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs cursor-pointer block w-full"
                  disabled={updateMutation.isPending}
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
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-[#0B1715] border-[rgba(196,154,84,0.2)] text-[#F2E9DB] hover:bg-[#101D1A] hover:text-[#C49A54] text-xs h-10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || updateMutation.isPending}
                  className="flex-1 bg-[#C49A54] hover:bg-[#A98245] text-[#07110F] font-semibold transition-colors duration-200 border-none text-xs h-10"
                >
                  {updateMutation.isPending ? (
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
