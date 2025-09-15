import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteScript } from "@/hooks/useScripts";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

export function DeleteScriptDialog({ open, onOpenChange, script }) {
  const deleteScriptMutation = useDeleteScript();

  const handleDelete = async () => {
    if (!script) return;
    
    try {
      await deleteScriptMutation.mutateAsync(script.id);
      onOpenChange(false);
    } catch (error) {
      // Hata toast hook tarafından işleniyor
    }
  };

  if (!script) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Script Silme Onayı
          </DialogTitle>
          <DialogDescription>
            Bu işlem geri alınamaz. Script ve tüm ilişkili verileri kalıcı olarak silinecek.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div className="text-sm text-muted-foreground">
              Bu script silinecek ve fiziksel dosya da sistemden kaldırılacak.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Script:</span>
              <span className="font-mono">{script.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Kategori:</span>
              <Badge variant="outline">{script.category}</Badge>
            </div>
            {script.subcategory && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Alt Kategori:</span>
                <span>{script.subcategory}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Versiyon:</span>
              <Badge variant="outline">{script.version}</Badge>
            </div>
            {script.description && (
              <div className="space-y-1">
                <span className="font-semibold">Açıklama:</span>
                <p className="text-sm text-muted-foreground">{script.description}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteScriptMutation.isPending}
          >
            İptal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteScriptMutation.isPending}
          >
            {deleteScriptMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Siliniyor...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Script'i Sil
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}