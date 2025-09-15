import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useFile } from "@/hooks/useFiles";
import { formatFileSize, getFileIcon, formatDate } from "@/lib/fileUtils";
import { Loader2, FileText } from "lucide-react";

export function FileDetailsDialog({ open, onOpenChange, fileId }) {
  const { data: fileData, isLoading, error } = useFile(fileId);
  
  const file = fileData?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {file ? (
              <>
                <div className="text-2xl">{getFileIcon(file.mime_type)}</div>
                {file.name}
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Dosya Detayları
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Dosya bilgileri ve özellikleri
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Dosya bilgileri yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Dosya bilgileri yüklenirken hata oluştu: {error.message}
            </p>
          </div>
        ) : file ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <Label className="font-semibold">Dosya Adı</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded">
                  {file.name}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="font-semibold">Temel Dosya Adı</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded">
                  {file.filename}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Dosya Uzantısı</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded">
                  {file.file_extension}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Dosya Boyutu</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded">
                  {formatFileSize(file.file_size)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">MIME Tipi</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded">
                  {file.mime_type}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Durum</Label>
                <Badge variant={file.is_temporary ? "secondary" : "success"}>
                  {file.is_temporary ? "Geçici" : "Kalıcı"}
                </Badge>
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="font-semibold">Dosya Yolu</Label>
                <p className="text-muted-foreground font-mono text-xs bg-muted/30 p-2 rounded break-all">
                  {file.file_path}
                </p>
              </div>

              {file.checksum && (
                <div className="space-y-2 col-span-2">
                  <Label className="font-semibold">Checksum</Label>
                  <p className="text-muted-foreground font-mono text-xs bg-muted/30 p-2 rounded break-all">
                    {file.checksum}
                  </p>
                </div>
              )}

              <div className="space-y-2 col-span-2">
                <Label className="font-semibold">Dosya ID</Label>
                <p className="text-muted-foreground bg-muted/30 p-2 rounded font-mono text-xs">
                  {file.id}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}