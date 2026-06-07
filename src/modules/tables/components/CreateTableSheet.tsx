import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { useCreateTableMutation } from '../hooks/useTables'
import { useAllSectionsQuery } from '@/modules/sections/hooks/useSections'
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

interface CreateTableSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTableSheet({ isOpen, onOpenChange }: CreateTableSheetProps) {
  const createMutation = useCreateTableMutation()
  const { data: sections = [], isLoading: isLoadingSections } = useAllSectionsQuery()

  const form = useForm({
    defaultValues: {
      number: '',
      capacity: '4',
      sectionId: '',
    },
    onSubmit: async ({ value }) => {
      const sId = parseInt(value.sectionId)
      const cap = parseInt(value.capacity)
      if (isNaN(sId) || sId <= 0 || isNaN(cap) || cap <= 0) return

      try {
        await createMutation.mutateAsync({
          number: value.number,
          capacity: cap,
          sectionId: sId,
        })
        form.reset()
        onOpenChange(false)
      } catch (err) {
        console.error(err)
      }
    },
  })

  // Establecer sección por defecto cuando se cargan las secciones
  useEffect(() => {
    if (sections.length > 0 && !form.state.values.sectionId && isOpen) {
      form.setFieldValue('sectionId', sections[0].id.toString())
    }
  }, [sections, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-[#112128] border-l border-[rgba(196,154,84,0.2)] text-white">
        <SheetHeader className="pb-6 border-b border-[rgba(196,154,84,0.1)]">
          <SheetTitle className="text-[#C49A54] font-display text-lg">Nueva Mesa</SheetTitle>
          <SheetDescription className="text-xs text-[#9CA3AF]">
            Registra una nueva mesa física y configúrala bajo una sección.
          </SheetDescription>
        </SheetHeader>

        {sections.length === 0 && !isLoadingSections ? (
          <div className="p-6 border border-dashed border-[rgba(196,154,84,0.2)] bg-[#0B1519]/40 rounded-lg text-center space-y-4 mt-6">
            <p className="text-xs text-[#9CA3AF]">Antes debes crear al menos una sección.</p>
            <Link to="/dashboard/sections" onClick={() => onOpenChange(false)}>
              <Button size="sm" className="bg-[#C49A54] hover:bg-[#A98245] text-[#0E1B21] font-semibold text-xs transition-colors duration-200">
                Configurar Secciones
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6 mt-6"
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
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                    Identificador / Número de Mesa
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. 12, VIP-1"
                    className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white placeholder-[#9CA3AF]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
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
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
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
                    className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white placeholder-[#9CA3AF]/40 focus-visible:ring-[#C49A54] focus-visible:border-[#C49A54] h-10 text-xs"
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

            {/* Campo: Sección */}
            <form.Field
              name="sectionId"
              validators={{
                onChange: ({ value }) => !value ? 'Debes seleccionar una sección' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-semibold text-[#C49A54] tracking-wide">
                    Sección Asignada
                  </Label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full flex h-10 rounded-md border border-[rgba(196,154,84,0.2)] bg-[#0B1519] text-white px-3 py-1 text-xs focus:ring-[#C49A54] focus:border-[#C49A54] disabled:opacity-50 cursor-pointer"
                    disabled={createMutation.isPending || isLoadingSections}
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id.toString()}>
                        {s.name} ({s.zoneName})
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
                    disabled={createMutation.isPending}
                    className="flex-1 bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-white hover:bg-[#112128] hover:text-[#C49A54] text-xs h-10"
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
        )}
      </SheetContent>
    </Sheet>
  )
}
