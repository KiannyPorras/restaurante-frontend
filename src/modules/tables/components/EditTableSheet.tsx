import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useUpdateTableMutation } from '../hooks/useTables'
import { useAllSectionsQuery } from '@/modules/sections/hooks/useSections'
import type { TableResponse } from '../models/tableModels'
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

interface EditTableSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  table: TableResponse | null
}

export function EditTableSheet({ isOpen, onOpenChange, table }: EditTableSheetProps) {
  const updateMutation = useUpdateTableMutation()
  const { data: sections = [], isLoading: isLoadingSections } = useAllSectionsQuery()

  const form = useForm({
    defaultValues: {
      number: '',
      capacity: '4',
      sectionId: '',
    },
    onSubmit: async ({ value }) => {
      if (!table) return
      const sId = parseInt(value.sectionId)
      const cap = parseInt(value.capacity)
      if (isNaN(sId) || sId <= 0 || isNaN(cap) || cap <= 0) return

      try {
        await updateMutation.mutateAsync({
          id: table.id,
          table: { number: value.number, capacity: cap, sectionId: sId },
        })
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Sincronizar campos cuando cambia la mesa a editar
  useEffect(() => {
    if (table && isOpen) {
      form.setFieldValue('number', table.number)
      form.setFieldValue('capacity', table.capacity.toString())
      form.setFieldValue('sectionId', table.sectionId.toString())
    }
  }, [table, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card">
        <SheetHeader className="pb-6">
          <SheetTitle>Editar Mesa</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Modifica la configuración de la mesa y su ubicación.
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
          {/* Campo: Número */}
          <form.Field
            name="number"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'El número es obligatorio'
                  : value.trim().length === 0
                  ? 'No puede estar vacío'
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Identificador / Número de Mesa
                  {isLoadingSections && <Loader2 className="h-3 w-3 animate-spin inline-block ml-1" />}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. 12, VIP-1"
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

          {/* Campo: Capacidad */}
          <form.Field
            name="capacity"
            validators={{
              onChange: ({ value }) => {
                const parsed = parseInt(value)
                if (!value) return 'La capacidad es obligatoria'
                if (isNaN(parsed) || parsed <= 0) return 'Debe ser un número entero mayor a 0'
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Capacidad (Cantidad de personas)
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. 4"
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

          {/* Campo: Sección */}
          <form.Field
            name="sectionId"
            validators={{
              onChange: ({ value }) => !value ? 'Debes seleccionar una sección' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Sección Asignada
                </Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={updateMutation.isPending || isLoadingSections}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id.toString()}>
                      {s.name} ({s.zoneName})
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
                  <span>Guardar Mesa</span>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </SheetContent>
    </Sheet>
  )
}
