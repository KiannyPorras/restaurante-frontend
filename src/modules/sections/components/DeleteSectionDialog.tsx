import { useDeleteSectionMutation } from '../hooks/useSections'
import type { SectionResponse } from '../models/sectionModels'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteSectionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  section: SectionResponse | null
}

export function DeleteSectionDialog({ isOpen, onOpenChange, section }: DeleteSectionDialogProps) {
  const deleteMutation = useDeleteSectionMutation()

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    if (!section) return
    e.preventDefault() // Detener cierre automático para manejarlo en el try-catch
    try {
      await deleteMutation.mutateAsync(section.id)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-[#112128] border border-[rgba(196,154,84,0.2)] text-[#FFFFFF] p-6">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <AlertDialogTitle className="text-[#C49A54] font-display text-lg">¿Confirmar eliminación?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-[#9D9A91] leading-relaxed">
            Esta acción es irreversible. Se eliminará permanentemente la sección{' '}
            <strong className="text-[#FFFFFF] font-semibold">"{section?.name}"</strong>.
            Si existen mesas vinculadas a esta sección, la operación podría fallar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3 flex flex-row justify-end border-t border-[rgba(196,154,84,0.1)] pt-4">
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="bg-[#0B1519] border-[rgba(196,154,84,0.2)] text-[#FFFFFF] hover:bg-[#112128] hover:text-[#C49A54] text-xs h-9 cursor-pointer"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="bg-red-950/40 border border-red-500/30 text-red-200 hover:bg-red-900/50 text-xs h-9 cursor-pointer"
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            )}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
