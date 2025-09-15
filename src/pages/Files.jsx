import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { helpContent } from "@/data/help-content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { FileUploadDialog } from "@/components/files/FileUploadDialog";
import { DeleteFileDialog } from "@/components/files/DeleteFileDialog";
import { FileDetailsDialog } from "@/components/files/FileDetailsDialog";
import { useFiles, useFilterFiles, useFilesCount } from "@/hooks/useFiles";
import { formatFileSize, getFileIcon, getFileTypeVariant, formatDate, getMimeTypeDisplayName } from "@/lib/fileUtils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Loader2,
  Upload,
  File,
  Calendar,
  HardDrive,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";

export default function Files() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [temporaryFilter, setTemporaryFilter] = useState("all");
  const [fileSizeMin, setFileSizeMin] = useState("");
  const [fileSizeMax, setFileSizeMax] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // API hooks
  const [useCustomFilter, setUseCustomFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  
  const { data: filesData, isLoading, error } = useFiles(
    useCustomFilter ? {} : {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      ...(searchTerm && { search: searchTerm }),
    }
  );
  
  const { data: countData } = useFilesCount();
  const filterMutation = useFilterFiles();

  const files = useCustomFilter ? filterMutation.data?.data?.items || [] : filesData?.data?.items || [];
  const totalFiles = useCustomFilter ? filterMutation.data?.data?.total || 0 : countData?.data?.count || 0;
  const totalPages = Math.ceil(totalFiles / pageSize);

  // Apply filters
  useEffect(() => {
    const hasFilters = fileTypeFilter !== "all" || 
                     temporaryFilter !== "all" ||
                     fileSizeMin || 
                     fileSizeMax ||
                     searchTerm;

    if (hasFilters) {
      const filterData = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      if (searchTerm) {
        filterData.original_filename = searchTerm;
      }
      
      if (fileTypeFilter !== "all") {
        filterData.file_type = fileTypeFilter;
      }
      
      if (temporaryFilter !== "all") {
        filterData.is_temporary = temporaryFilter === "true";
      }
      
      if (fileSizeMin) {
        filterData.file_size_min = parseInt(fileSizeMin) * 1024; // Convert KB to bytes
      }
      
      if (fileSizeMax) {
        filterData.file_size_max = parseInt(fileSizeMax) * 1024; // Convert KB to bytes
      }

      setFilterParams(filterData);
      filterMutation.mutate(filterData);
      setUseCustomFilter(true);
    } else {
      setUseCustomFilter(false);
    }
  }, [fileTypeFilter, temporaryFilter, fileSizeMin, fileSizeMax, searchTerm, currentPage, pageSize]);

  // File type options from files
  const fileTypes = useMemo(() => {
    const types = new Set();
    files.forEach(file => {
      if (file.file_type) types.add(file.file_type);
    });
    return Array.from(types).sort();
  }, [files]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFileTypeFilter("all");
    setTemporaryFilter("all");
    setFileSizeMin("");
    setFileSizeMax("");
    setCurrentPage(1);
  };

  const displayedFiles = files || [];
  const isLoadingData = isLoading || filterMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Dosya Yönetimi"
          description="Workflow dosyalarınızı yükleyin, yönetin ve organize edin"
          icon={File}
          actions={[
            <Button 
              key="upload-file"
              onClick={() => setShowUploadDialog(true)} 
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Dosya Yükle
            </Button>
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Toplam Dosya</p>
                  <p className="text-2xl font-bold">{totalFiles}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <File className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Geçici Dosyalar</p>
                  <p className="text-2xl font-bold">
                    {displayedFiles.filter(f => f.is_temporary).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Toplam Boyut</p>
                  <p className="text-2xl font-bold">
                    {formatFileSize(displayedFiles.reduce((sum, file) => sum + (file.file_size || 0), 0))}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <HardDrive className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-xl bg-gradient-to-r from-card/90 via-card/80 to-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtreler
            </CardTitle>
            <CardDescription>
              Dosyaları filtreleyerek istediğinizi kolayca bulun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Dosya Adı Ara</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Dosya adı..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* File Type */}
              <div className="space-y-2">
                <Label>Dosya Tipi</Label>
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md z-50">
                    <SelectItem value="all">Tüm Tipler</SelectItem>
                    {fileTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {getMimeTypeDisplayName(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Temporary Status */}
              <div className="space-y-2">
                <Label>Durum</Label>
                <Select value={temporaryFilter} onValueChange={setTemporaryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md z-50">
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="false">Kalıcı</SelectItem>
                    <SelectItem value="true">Geçici</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Size Min */}
              <div className="space-y-2">
                <Label>Min Boyut (KB)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={fileSizeMin}
                  onChange={(e) => setFileSizeMin(e.target.value)}
                />
              </div>

              {/* File Size Max */}
              <div className="space-y-2">
                <Label>Max Boyut (KB)</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={fileSizeMax}
                  onChange={(e) => setFileSizeMax(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card/90 to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <File className="w-6 h-6 text-primary" />
              </div>
              Dosyalar ({displayedFiles.length})
            </CardTitle>
            <CardDescription className="text-lg">
              Yüklenen dosyaların listesi ve detayları
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Dosyalar yükleniyor...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Dosyalar yüklenirken bir hata oluştu: {error.message}</p>
              </div>
            ) : displayedFiles.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Henüz dosya bulunamadı.</p>
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Dosyanızı Yükleyin
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-lg overflow-hidden border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Dosya
                            <HelpTooltip content="Dosya adı ve icon" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Boyut
                            <HelpTooltip content="Dosya boyutu" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Tip
                            <HelpTooltip content="Dosya tipi (MIME)" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Durum
                            <HelpTooltip content="Geçici veya kalıcı dosya" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            Yükleme
                            <HelpTooltip content="Yüklenme tarihi" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        {displayedFiles.some(f => f.expires_at) && (
                          <TableHead>
                            <div className="flex items-center gap-2">
                              Son Kullanma
                              <HelpTooltip content="Dosyanın son kullanma tarihi" iconSize="w-3 h-3" />
                            </div>
                          </TableHead>
                        )}
                        <TableHead className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            İşlemler
                            <HelpTooltip content="Dosya işlemleri" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedFiles.map((file) => (
                        <TableRow key={file.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl p-2 rounded-lg bg-muted/50">
                                {getFileIcon(file.file_type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate">
                                  {file.original_filename}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono truncate">
                                  {file.stored_filename}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatFileSize(file.file_size)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getFileTypeVariant(file.file_type)}>
                              {getMimeTypeDisplayName(file.file_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={file.is_temporary ? "secondary" : "success"}>
                              {file.is_temporary ? "Geçici" : "Kalıcı"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(file.uploaded_at)}
                          </TableCell>
                          {displayedFiles.some(f => f.expires_at) && (
                            <TableCell className="text-muted-foreground">
                              {file.expires_at ? formatDate(file.expires_at) : "-"}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedFileId(file.id)}
                                title="Detayları Görüntüle"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                title="İndir"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setDeletingFile({ 
                                  id: file.id, 
                                  name: file.original_filename
                                })}
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Sayfa {currentPage} / {totalPages} ({totalFiles} dosya)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Sonraki
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <FileUploadDialog 
          open={showUploadDialog} 
          onOpenChange={setShowUploadDialog} 
        />
        
        <FileDetailsDialog 
          open={!!selectedFileId} 
          onOpenChange={(open) => !open && setSelectedFileId(null)}
          fileId={selectedFileId}
        />
        
        <DeleteFileDialog 
          open={!!deletingFile} 
          onOpenChange={(open) => !open && setDeletingFile(null)}
          fileId={deletingFile?.id}
          fileName={deletingFile?.name}
        />
      </div>
    </div>
  );
}