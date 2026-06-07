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
      <SheetContent className="sm:max-w-md bg-[#101D1A] border-l border-[rgba(196,154,84,0.2)] text-[#F2E9DB]">
        <SheetHeader className="pb-6 border-b border-[rgba(196,154,84,0.1)]">
          <SheetTitle className="text-[#C49A54] font-display text-lg">Editar Sección</SheetTitle>
          <SheetDescription className="text-xs text-[#9D9A91]">
            Modifica la sección seleccionada y su zona asociada.
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
                  : value.length < 2
                  ? 'Debe tener al menos 2 caracteres'
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                  Nombre de la Sección
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Balcón Izquierdo"
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

          {/* Campo: Zona */}
          <form.Field
            name="zoneId"
            validators={{
              onChange: ({ value }) => !value ? 'Debes seleccionar una zona' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                  Zona del Restaurante
                </Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-[rgba(196,154,84,0.2)] bg-[#0B1715] text-[#F2E9DB] px-3 py-1 text-xs focus:ring-[#C49A54] focus:border-[#C49A54] disabled:opacity-50 cursor-pointer"
                  disabled={updateMutation.isPending || isLoadingZones}
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id.toString()}>
                      {z.name}
                    </option>
                  ))}
                </select>
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
