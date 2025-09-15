import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/hooks/useFiles";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_TYPES = [
  'application/pdf',
  'application/json',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export function FileUploadDialog({ open, onOpenChange }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTemporary, setIsTemporary] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const uploadMutation = useUploadFile();

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `Dosya boyutu 100MB'dan büyük olamaz (${formatFileSize(file.size)})`;
    }
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return `Desteklenmeyen dosya tipi: ${file.type}`;
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validatedFiles = fileArray.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      name: file.name,
      size: file.size,
      type: file.type,
      error: validateFile(file),
      status: 'pending' // pending, uploading, success, error
    }));
    
    setSelectedFiles(prev => [...prev, ...validatedFiles]);
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    const validFiles = selectedFiles.filter(f => !f.error && f.status === 'pending');
    
    for (const fileData of validFiles) {
      try {
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
        );
        
        await uploadMutation.mutateAsync({
          file: fileData.file,
          isTemporary
        });
        
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'success' } : f)
        );
      } catch (error) {
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { 
            ...f, 
            status: 'error',
            error: error.response?.data?.message || 'Yükleme hatası'
          } : f)
        );
      }
    }

    // Close dialog after successful uploads
    const hasErrors = selectedFiles.some(f => f.status === 'error');
    if (!hasErrors) {
      setTimeout(() => {
        onOpenChange(false);
        setSelectedFiles([]);
        setIsTemporary(false);
      }, 1000);
    }
  };

  const getStatusIcon = (status, error) => {
    if (error && status === 'pending') return <AlertCircle className="w-4 h-4 text-destructive" />;
    if (status === 'uploading') return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-destructive" />;
    return null;
  };

  const canUpload = selectedFiles.length > 0 && selectedFiles.some(f => !f.error && f.status === 'pending');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Dosya Yükle
          </DialogTitle>
          <DialogDescription>
            Dosyalarınızı sürükleyip bırakın veya seçin (Maksimum 100MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/30 hover:border-primary/50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`mx-auto h-12 w-12 mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {dragActive ? 'Dosyaları buraya bırakın!' : 'Dosyaları sürükleyin veya seçin'}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, JSON, TXT, CSV, JPG, PNG, Excel dosyaları desteklenir
              </p>
              <Label htmlFor="file-input">
                <Button variant="outline" className="mt-2" asChild>
                  <span>Dosya Seç</span>
                </Button>
                <Input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.json,.txt,.csv,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </Label>
            </div>
          </div>

          {/* File List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Label className="text-sm font-medium">Seçilen Dosyalar ({selectedFiles.length})</Label>
              {selectedFiles.map((fileData) => (
                <div key={fileData.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(fileData.status, fileData.error)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileData.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileData.size)}
                        {fileData.error && (
                          <span className="text-destructive ml-2">{fileData.error}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileData.id)}
                    disabled={fileData.status === 'uploading'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="temporary"
              checked={isTemporary}
              onCheckedChange={setIsTemporary}
            />
            <Label htmlFor="temporary" className="text-sm">
              Geçici dosya olarak işaretle (otomatik silinir)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button 
            onClick={uploadFiles} 
            disabled={!canUpload || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Yükleniyor...' : 'Yükle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}