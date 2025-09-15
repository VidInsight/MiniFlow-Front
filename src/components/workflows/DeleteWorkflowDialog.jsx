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
import { useDeleteWorkflow } from "@/hooks/useWorkflows";
import { Loader2, AlertTriangle } from "lucide-react";

export function DeleteWorkflowDialog({ 
  open, 
  onOpenChange, 
  workflowId, 
  workflowName,
  hasActiveExecutions = false 
}) {
  const deleteWorkflow = useDeleteWorkflow();

  const handleDelete = async () => {
    try {
      await deleteWorkflow.mutateAsync(workflowId);
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
            Workflow Silme Onayı
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              <strong>"{workflowName}"</strong> workflow'unu silmek istediğinizden emin misiniz?
            </p>
            
            {hasActiveExecutions && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Uyarı: Bu workflow'un aktif çalıştırmaları bulunmaktadır.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Workflow silindiğinde tüm aktif çalıştırmalar durdurulacak ve geçmiş veriler kaybolacaktır.
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Bu işlem geri alınamaz. Workflow ve tüm ilişkili verileri kalıcı olarak silinecektir.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteWorkflow.isPending}>
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteWorkflow.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteWorkflow.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Workflow'u Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}