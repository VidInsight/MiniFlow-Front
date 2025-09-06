import { useState } from "react";
import { Upload, File, Trash2, Download, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function FileUpload() {
  const [files, setFiles] = useState([
    {
      id: "FU-A1B2C3D4E5F6G7H8I",
      name: "data_report.pdf",
      filename: "data_report",
      file_extension: ".pdf",
      file_path: "/uploads/2024/01/01/data_report.pdf",
      file_size: 2048576,
      mime_type: "application/pdf",
      checksum: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      is_temporary: false,
      created_at: "2024-01-01T12:00:00",
      updated_at: "2024-01-01T12:00:00"
    },
    {
      id: "FU-B2C3D4E5F6G7H8I9J",
      name: "workflow_config.json",
      filename: "workflow_config", 
      file_extension: ".json",
      file_path: "/uploads/2024/01/02/workflow_config.json",
      file_size: 1024,
      mime_type: "application/json",
      checksum: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
      is_temporary: true,
      created_at: "2024-01-02T10:30:00",
      updated_at: "2024-01-02T10:30:00"
    }
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (extension) => {
    const iconMap = {
      '.pdf': '📄',
      '.json': '📋',
      '.txt': '📝',
      '.csv': '📊',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.png': '🖼️'
    };
    return iconMap[extension] || '📎';
  };

  const getFileTypeVariant = (extension) => {
    const variantMap = {
      '.pdf': 'destructive',
      '.json': 'default',
      '.txt': 'secondary',
      '.csv': 'success',
      '.jpg': 'warning',
      '.jpeg': 'warning',
      '.png': 'warning'
    };
    return variantMap[extension] || 'outline';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = (fileList) => {
    Array.from(fileList).forEach((file) => {
      const newFile = {
        id: `FU-${Math.random().toString(36).substring(2, 17).toUpperCase()}`,
        name: file.name,
        filename: file.name.substring(0, file.name.lastIndexOf('.')),
        file_extension: file.name.substring(file.name.lastIndexOf('.')),
        file_path: `/uploads/${new Date().toISOString().split('T')[0]}/${file.name}`,
        file_size: file.size,
        mime_type: file.type,
        checksum: Math.random().toString(36).substring(2, 34),
        is_temporary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setFiles(prev => [...prev, newFile]);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and processed.`,
      });
    });
  };

  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "File has been removed from the system.",
      variant: "destructive"
    });
  };

  const toggleTemporary = (fileId) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, is_temporary: !file.is_temporary, updated_at: new Date().toISOString() }
        : file
    ));
    toast({
      title: "File status updated",
      description: "File temporary status has been changed.",
    });
  };

  const totalFiles = files.length;
  const totalSize = files.reduce((sum, file) => sum + file.file_size, 0);
  const temporaryFiles = files.filter(file => file.is_temporary).length;

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              File Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload, manage and organize your workflow files with ease
            </p>
          </div>
        </div>
      </div>


      {/* Upload Area */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            Upload Files
          </CardTitle>
          <CardDescription className="text-base">
            Drag and drop files here or click to browse your files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
              ${dragActive 
                ? 'border-primary bg-primary/5 shadow-lg scale-[1.02] shadow-primary/20' 
                : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className={`mx-auto h-16 w-16 mb-4 transition-colors ${
                dragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="text-xl font-semibold mb-2 text-foreground">
                {dragActive ? 'Drop files here!' : 'Drop files here'}
              </p>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Supports PDF, JSON, TXT, CSV, JPG, PNG files up to 50MB each
              </p>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Choose Files
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.json,.txt,.csv,.jpg,.jpeg,.png"
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Uploaded Files</CardTitle>
          <CardDescription className="text-base">
            Manage your uploaded files and their properties
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="rounded-lg overflow-hidden border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b border-border/50">
                  <TableHead className="font-semibold text-foreground px-6 py-4">File</TableHead>
                  <TableHead className="font-semibold text-foreground">Size</TableHead>
                  <TableHead className="font-semibold text-foreground">Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Uploaded</TableHead>
                  <TableHead className="text-right font-semibold text-foreground pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/20 transition-colors border-b border-border/30">
                    <TableCell className="font-medium px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl p-2 rounded-lg bg-muted/50">
                          {getFileIcon(file.file_extension)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{file.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            ID: {file.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-medium">{formatFileSize(file.file_size)}</TableCell>
                    <TableCell>
                      <Badge variant={getFileTypeVariant(file.file_extension)} className="font-medium">
                        {file.file_extension}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={file.is_temporary ? "secondary" : "success"}
                        className="cursor-pointer hover:scale-105 transition-transform font-medium"
                        onClick={() => toggleTemporary(file.id)}
                      >
                        {file.is_temporary ? (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Temporary
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Permanent
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(file.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => setSelectedFile(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-background border border-border shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl flex items-center gap-2">
                                <div className="text-2xl">{getFileIcon(file.file_extension)}</div>
                                {selectedFile?.name}
                              </DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                File details and properties
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFile && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">File Name</Label>
                                    <p className="text-muted-foreground bg-muted/30 p-2 rounded">{selectedFile.name}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Size</Label>
                                    <p className="text-muted-foreground bg-muted/30 p-2 rounded">{formatFileSize(selectedFile.file_size)}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Type</Label>
                                    <p className="text-muted-foreground bg-muted/30 p-2 rounded">{selectedFile.mime_type}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Status</Label>
                                    <Badge variant={selectedFile.is_temporary ? "secondary" : "success"}>
                                      {selectedFile.is_temporary ? "Temporary" : "Permanent"}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Label className="font-semibold text-foreground">Checksum</Label>
                                    <p className="text-muted-foreground font-mono text-xs bg-muted/30 p-2 rounded break-all">{selectedFile.checksum}</p>
                                  </div>
                                  <div className="space-y-2 col-span-2">
                                    <Label className="font-semibold text-foreground">Path</Label>
                                    <p className="text-muted-foreground font-mono text-xs bg-muted/30 p-2 rounded break-all">{selectedFile.file_path}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Created</Label>
                                    <p className="text-muted-foreground bg-muted/30 p-2 rounded">{new Date(selectedFile.created_at).toLocaleString()}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Modified</Label>
                                    <p className="text-muted-foreground bg-muted/30 p-2 rounded">{new Date(selectedFile.updated_at).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-success/10 hover:text-success transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}