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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="text-muted-foreground">
            Upload, manage and organize your workflow files
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              {temporaryFiles} temporary files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Across all uploads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Types</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...new Set(files.map(f => f.file_extension))].length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different formats
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, JSON, TXT, CSV, JPG, PNG files up to 50MB
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline">
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
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            Manage your uploaded files and their properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFileIcon(file.file_extension)}</span>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {file.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(file.file_size)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.file_extension}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={file.is_temporary ? "secondary" : "default"}
                      className="cursor-pointer"
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
                  <TableCell>
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedFile(file)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{selectedFile?.name}</DialogTitle>
                            <DialogDescription>File details and properties</DialogDescription>
                          </DialogHeader>
                          {selectedFile && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="font-medium">File Name</Label>
                                  <p className="text-muted-foreground">{selectedFile.name}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Size</Label>
                                  <p className="text-muted-foreground">{formatFileSize(selectedFile.file_size)}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Type</Label>
                                  <p className="text-muted-foreground">{selectedFile.mime_type}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Checksum</Label>
                                  <p className="text-muted-foreground font-mono text-xs">{selectedFile.checksum}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Path</Label>
                                  <p className="text-muted-foreground font-mono text-xs">{selectedFile.file_path}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Created</Label>
                                  <p className="text-muted-foreground">{new Date(selectedFile.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}