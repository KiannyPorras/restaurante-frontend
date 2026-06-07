import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useCreateSectionMutation } from '../hooks/useSections'
import { useAllZonesQuery } from '@/modules/zones/hooks/useZones'
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
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

interface CreateSectionSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSectionSheet({ isOpen, onOpenChange }: CreateSectionSheetProps) {
  const createMutation = useCreateSectionMutation()
  const { data: zones = [], isLoading: isLoadingZones } = useAllZonesQuery()

  const form = useForm({
    defaultValues: {
      name: '',
      zoneId: '',
    },
    onSubmit: async ({ value }) => {
      const zId = parseInt(value.zoneId)
      if (isNaN(zId) || zId <= 0) return

      try {
        await createMutation.mutateAsync({
          name: value.name,
          zoneId: zId,
        })
        form.reset()
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Establecer valor por defecto para zoneId cuando se cargan las zonas
  useEffect(() => {
    if (zones.length > 0 && !form.state.values.zoneId && isOpen) {
      form.setFieldValue('zoneId', zones[0].id.toString())
    }
  }, [zones, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card">
        <SheetHeader className="pb-6">
          <SheetTitle>Nueva Sección</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Asocia una sub-área de mesas a una zona del local.
          </SheetDescription>
        </SheetHeader>

        {zones.length === 0 && !isLoadingZones ? (
          <div className="p-4 border border-dashed border-border rounded-lg text-center space-y-2">
            <p className="text-xs text-muted-foreground">Antes debes crear al menos una zona.</p>
            <Link to="/dashboard/zones" onClick={() => onOpenChange(false)}>
              <Button size="xs" variant="outline">Configurar Zonas</Button>
            </Link>
          </div>
        ) : (
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
                    : value.length < 2
                    ? 'Debe tener al menos 2 caracteres'
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs font-semibold">
                    Nombre de la Sección
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. Balcón Izquierdo"
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

            {/* Campo: Zona */}
            <form.Field
              name="zoneId"
              validators={{
                onChange: ({ value }) => !value ? 'Debes seleccionar una zona' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs font-semibold">
                    Zona del Restaurante
                  </Label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={createMutation.isPending || isLoadingZones}
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id.toString()}>
                        {z.name}
                      </option>
                    ))}
                  </select>
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
                    <span>Guardar Sección</span>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
