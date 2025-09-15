import React, { useState, useEffect, useMemo } from "react";
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
import { CreateScriptDialog } from "@/components/scripts/CreateScriptDialog";
import { DeleteScriptDialog } from "@/components/scripts/DeleteScriptDialog";
import { ScriptDetailsDialog } from "@/components/scripts/ScriptDetailsDialog";
import { EditScriptDialog } from "@/components/scripts/EditScriptDialog";
import { useScripts, useFilterScripts, useScriptsCount } from "@/hooks/useScripts";
import { formatFileSize, formatDate } from "@/lib/fileUtils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play,
  Code2,
  Clock,
  Filter,
  FileText,
  BarChart3,
  CheckCircle2,
  Tag,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileCode
} from "lucide-react";

// Mock data for fallback
const mockScripts = [
  {
    id: "SC-001",
    name: "csv_processor",
    description: "Processes CSV files with validation and transformation",
    version: "1.2.0",
    category: "data_processing",
    subcategory: "etl",
    file_extension: "py",
    file_size: 2048,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    author: "dev@miniflow.dev"
  },
  {
    id: "SC-002",
    name: "email_sender",
    description: "Sends automated email notifications with templates",
    version: "2.0.1",
    category: "communication",
    subcategory: "email",
    file_extension: "js",
    file_size: 1536,
    created_at: "2024-01-12T09:15:00Z",
    updated_at: "2024-01-14T16:20:00Z",
    author: "admin@miniflow.dev"
  },
  {
    id: "SC-003",
    name: "database_backup",
    description: "Creates automated backups of database with compression",
    version: "1.0.0",
    category: "maintenance",
    subcategory: "backup",
    file_extension: "sh",
    file_size: 512,
    created_at: "2024-01-10T11:45:00Z",
    updated_at: "2024-01-10T11:45:00Z",
    author: "admin@miniflow.dev"
  },
];

const getCategoryBadge = (category) => {
  const variants = {
    "data_processing": "success",
    "communication": "secondary",
    "maintenance": "warning",
    "validation": "outline"
  };
  
  return <Badge variant={variants[category] || "outline"}>
    {category.replace('_', ' ')}
  </Badge>;
};

const getExtensionBadge = (extension) => {
  const colors = {
    "py": "success",
    "js": "warning", 
    "sh": "secondary",
    "sql": "outline"
  };
  
  return <Badge variant={colors[extension] || "outline"}>
    {extension.toUpperCase()}
  </Badge>;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export default function Scripts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("");
  const [extensionFilter, setExtensionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState(null);
  const [deletingScript, setDeletingScript] = useState(null);
  const [editingScriptId, setEditingScriptId] = useState(null);
  
  // API hooks
  const [useCustomFilter, setUseCustomFilter] = useState(false);
  
  const { data: scriptsData, isLoading, error } = useScripts(
    useCustomFilter ? {} : {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      exclude_fields: "content", // Performans için content alanını hariç tut
      ...(searchTerm && { search: searchTerm }),
    }
  );
  
  const { data: countData } = useScriptsCount();
  const filterMutation = useFilterScripts();

  // Script verileri - API'den gelen veri ya da mock veri
  const scripts = useCustomFilter ? filterMutation.data?.data?.items || mockScripts : scriptsData?.data?.items || mockScripts;
  const totalScripts = useCustomFilter ? filterMutation.data?.data?.total || mockScripts.length : countData?.data?.count || mockScripts.length;
  const totalPages = Math.ceil(totalScripts / pageSize);

  // Apply filters
  useEffect(() => {
    const hasFilters = categoryFilter !== "all" || 
                      subcategoryFilter !== "all" ||
                      authorFilter || 
                      extensionFilter !== "all" ||
                      searchTerm;

    if (hasFilters) {
      const filterData = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        exclude_fields: "content", // Performans için
      };

      if (searchTerm) {
        filterData.name = searchTerm;
      }
      
      if (categoryFilter !== "all") {
        filterData.category = categoryFilter;
      }
      
      if (subcategoryFilter !== "all") {
        filterData.subcategory = subcategoryFilter;
      }
      
      if (authorFilter) {
        filterData.author = authorFilter;
      }
      
      if (extensionFilter !== "all") {
        filterData.file_extension = extensionFilter;
      }

      filterMutation.mutate(filterData);
      setUseCustomFilter(true);
    } else {
      setUseCustomFilter(false);
    }
  }, [categoryFilter, subcategoryFilter, authorFilter, extensionFilter, searchTerm, currentPage, pageSize]);

  // Get unique values for filters
  const categories = useMemo(() => {
    const cats = new Set();
    scripts.forEach(script => {
      if (script.category) cats.add(script.category);
    });
    return Array.from(cats).sort();
  }, [scripts]);

  const subcategories = useMemo(() => {
    const subcats = new Set();
    scripts.forEach(script => {
      if (script.subcategory && (categoryFilter === "all" || script.category === categoryFilter)) {
        subcats.add(script.subcategory);
      }
    });
    return Array.from(subcats).sort();
  }, [scripts, categoryFilter]);

  const authors = useMemo(() => {
    const auths = new Set();
    scripts.forEach(script => {
      if (script.author) auths.add(script.author);
    });
    return Array.from(auths).sort();
  }, [scripts]);

  const extensions = useMemo(() => {
    const exts = new Set();
    scripts.forEach(script => {
      if (script.file_extension) exts.add(script.file_extension);
    });
    return Array.from(exts).sort();
  }, [scripts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSubcategoryFilter("all");
    setAuthorFilter("");
    setExtensionFilter("all");
    setCurrentPage(1);
  };

  const displayedScripts = scripts || [];
  const isLoadingData = isLoading || filterMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Script Yönetimi"
          description="Workflow automation scriptlerinizi oluşturun, düzenleyin ve yönetin"
          icon={Code2}
          actions={[
            <Button 
              key="import"
              variant="outline"
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:scale-105 transition-all duration-300 shadow-soft"
            >
              <FileText className="w-4 h-4 mr-2" />
              Script İçe Aktar
            </Button>,
            <Button 
              key="create-script"
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Script
            </Button>
          ]}
        />

        {/* Enhanced Filters */}
        <Card className="shadow-xl bg-gradient-to-r from-card/90 via-card/80 to-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Gelişmiş Filtreler
            </CardTitle>
            <CardDescription>
              Scriptlerinizi kategorize edin ve hızlı arama yapın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Script Ara</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Script adı veya açıklama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md z-50">
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label>Alt Kategori</Label>
                <Select 
                  value={subcategoryFilter} 
                  onValueChange={setSubcategoryFilter}
                  disabled={subcategories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alt kategori seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md z-50">
                    <SelectItem value="all">Tüm Alt Kategoriler</SelectItem>
                    {subcategories.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label>Yazar</Label>
                <Input
                  placeholder="Yazar ara..."
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                />
              </div>

              {/* File Extension */}
              <div className="space-y-2">
                <Label>Dosya Uzantısı</Label>
                <Select value={extensionFilter} onValueChange={setExtensionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md z-50">
                    <SelectItem value="all">Tüm Uzantılar</SelectItem>
                    {extensions.map(ext => (
                      <SelectItem key={ext} value={ext}>
                        .{ext.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Filtreleri Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scripts Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card/90 to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              Scriptler ({displayedScripts.length})
            </CardTitle>
            <CardDescription className="text-lg">
              Automation scriptleri ve performans metrikleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Scriptler yükleniyor...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Scriptler yüklenirken bir hata oluştu: {error.message}</p>
              </div>
            ) : displayedScripts.length === 0 ? (
              <div className="text-center py-8">
                <FileCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Henüz script bulunamadı.</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Script'inizi Oluşturun
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
                            Script
                            <HelpTooltip content="Script adı, açıklama ve kategori bilgileri" iconSize="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Versiyon</TableHead>
                        <TableHead>Uzantı</TableHead>
                        <TableHead>Yazar</TableHead>
                        <TableHead>Güncelleme</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedScripts.map((script) => (
                        <TableRow key={script.id} className="hover:bg-muted/20 transition-colors">
                          <TableCell className="font-medium">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-medium text-sm">{script.name}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-md">
                                {script.description}
                              </p>
                              {script.subcategory && (
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {script.subcategory}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getCategoryBadge(script.category)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{script.version}</Badge>
                          </TableCell>
                          <TableCell>
                            {getExtensionBadge(script.file_extension)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {script.author || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(script.updated_at || script.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedScriptId(script.id)}>
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingScriptId(script.id)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeletingScript(script)}>
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
                      Sayfa {currentPage} / {totalPages} (Toplam {totalScripts} script)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
        <CreateScriptDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog} 
        />
        
        <ScriptDetailsDialog 
          open={!!selectedScriptId} 
          onOpenChange={(open) => !open && setSelectedScriptId(null)}
          scriptId={selectedScriptId}
        />
        
        <EditScriptDialog 
          open={!!editingScriptId} 
          onOpenChange={(open) => !open && setEditingScriptId(null)}
          scriptId={editingScriptId}
        />
        
        <DeleteScriptDialog 
          open={!!deletingScript} 
          onOpenChange={(open) => !open && setDeletingScript(null)}
          script={deletingScript}
        />
      </div>
    </div>
  );
}