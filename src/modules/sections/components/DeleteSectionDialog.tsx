import { useDeleteSectionMutation } from '../hooks/useSections'
import type { SectionResponse } from '../models/sectionModels'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface DeleteSectionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  section: SectionResponse | null
}

export function DeleteSectionDialog({ isOpen, onOpenChange, section }: DeleteSectionDialogProps) {
  const deleteMutation = useDeleteSectionMutation()

  const handleDeleteConfirm = async () => {
    if (!section) return
    try {
      await deleteMutation.mutateAsync(section.id)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Esta acción es irreversible. Se eliminará la sección{' '}
            <strong className="text-foreground">"{section?.name}"</strong>. 
            Si existen mesas vinculadas a esta sección, la operación podría fallar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            )}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
