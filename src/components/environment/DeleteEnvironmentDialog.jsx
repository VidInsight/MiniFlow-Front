import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteEnvironmentVariable } from "@/hooks/useEnvironment";
import { Loader2, AlertTriangle } from "lucide-react";

export function DeleteEnvironmentDialog({ 
  open, 
  onOpenChange, 
  envarId, 
  envarName
}) {
  const deleteEnvironmentVariable = useDeleteEnvironmentVariable();

  const handleDelete = async () => {
    try {
      await deleteEnvironmentVariable.mutateAsync(envarId);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Ortam Değişkeni Silme Onayı
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              <strong>"{envarName}"</strong> ortam değişkenini silmek istediğinizden emin misiniz?
            </p>
            
            <p className="text-sm text-muted-foreground">
              Bu işlem geri alınamaz. Ortam değişkeni kalıcı olarak silinecektir.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteEnvironmentVariable.isPending}>
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteEnvironmentVariable.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteEnvironmentVariable.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Değişkeni Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}