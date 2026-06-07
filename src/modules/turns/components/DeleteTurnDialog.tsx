import { useDeleteTurnMutation } from '../hooks/useTurns'
import type { TurnResponse } from '../models/turnModels'
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

interface DeleteTurnDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  turn: TurnResponse | null
}

export function DeleteTurnDialog({ isOpen, onOpenChange, turn }: DeleteTurnDialogProps) {
  const deleteMutation = useDeleteTurnMutation()

  const handleDeleteConfirm = async () => {
    if (!turn) return
    try {
      await deleteMutation.mutateAsync(turn.id)
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
            Esta acción es irreversible. Se eliminará el turno{' '}
            <strong className="text-foreground">"{turn?.name}"</strong>.
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
