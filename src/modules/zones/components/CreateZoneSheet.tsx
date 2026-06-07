import { useForm } from '@tanstack/react-form'
import { useCreateZoneMutation } from '../hooks/useZones'
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

interface CreateZoneSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateZoneSheet({ isOpen, onOpenChange }: CreateZoneSheetProps) {
  const createMutation = useCreateZoneMutation()

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          name: value.name,
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
          <SheetTitle>Nueva Zona</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Registra una nueva área física para el restaurante.
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
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Nombre de la Zona
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Terraza Exterior"
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
                  <span>Guardar Zona</span>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  )
}
