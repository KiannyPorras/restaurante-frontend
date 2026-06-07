import { useDeleteZoneMutation } from '../hooks/useZones'
import type { ZoneResponse } from '../models/zoneModels'
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

interface DeleteZoneDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  zone: ZoneResponse | null
}

export function DeleteZoneDialog({ isOpen, onOpenChange, zone }: DeleteZoneDialogProps) {
  const deleteMutation = useDeleteZoneMutation()

  const handleDeleteConfirm = async () => {
    if (!zone) return
    try {
      await deleteMutation.mutateAsync(zone.id)
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
            Esta acción es irreversible. Se eliminará la zona{' '}
            <strong className="text-foreground">"{zone?.name}"</strong>. 
            Si existen secciones o mesas vinculadas, la operación podría fallar.
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
