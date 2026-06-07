import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useUpdateSectionMutation } from '../hooks/useSections'
import { useAllZonesQuery } from '@/modules/zones/hooks/useZones'
import type { SectionResponse } from '../models/sectionModels'
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

interface EditSectionSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  section: SectionResponse | null
}

export function EditSectionSheet({ isOpen, onOpenChange, section }: EditSectionSheetProps) {
  const updateMutation = useUpdateSectionMutation()
  const { data: zones = [], isLoading: isLoadingZones } = useAllZonesQuery()

  const form = useForm({
    defaultValues: {
      name: '',
      zoneId: '',
    },
    onSubmit: async ({ value }) => {
      if (!section) return
      const zId = parseInt(value.zoneId)
      if (isNaN(zId) || zId <= 0) return

      try {
        await updateMutation.mutateAsync({
          id: section.id,
          section: { name: value.name, zoneId: zId },
        })
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Sincronizar campos cuando cambia el item a editar
  useEffect(() => {
    if (section && isOpen) {
      form.setFieldValue('name', section.name)
      form.setFieldValue('zoneId', section.zoneId.toString())
    }
  }, [section, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card">
        <SheetHeader className="pb-6">
          <SheetTitle>Editar Sección</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Modifica la sección seleccionada y su zona asociada.
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
                  disabled={updateMutation.isPending}
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
                  {isLoadingZones && <Loader2 className="h-3 w-3 animate-spin inline-block ml-1" />}
                </Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={updateMutation.isPending || isLoadingZones}
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
                disabled={!canSubmit || isSubmitting || updateMutation.isPending}
                className="w-full mt-6"
              >
                {updateMutation.isPending ? (
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
      </SheetContent>
    </Sheet>
  )
}
