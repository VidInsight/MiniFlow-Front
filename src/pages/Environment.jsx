import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CreateEnvironmentDialog } from "@/components/environment/CreateEnvironmentDialog";
import { EditEnvironmentDialog } from "@/components/environment/EditEnvironmentDialog";
import { DeleteEnvironmentDialog } from "@/components/environment/DeleteEnvironmentDialog";
import { useEnvironmentVariables } from "@/hooks/useEnvironment";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield,
  Globe,
  User,
  Clock,
  Filter,
  Loader2,
  Server,
  Workflow as WorkflowIcon
} from "lucide-react";

// Helper functions
const getScopeIcon = (scope) => {
  const scopeIcons = {
    "GLOBAL": <Globe className="w-4 h-4" />,
    "WORKFLOW": <WorkflowIcon className="w-4 h-4" />,
    "EXECUTION": <Server className="w-4 h-4" />,
  };
  return scopeIcons[scope] || <Shield className="w-4 h-4" />;
};


const getScopeBadge = (scope) => {
  const scopeBadges = {
    "GLOBAL": <Badge variant="success">Global</Badge>,
    "WORKFLOW": <Badge variant="warning">Workflow</Badge>,
    "EXECUTION": <Badge variant="secondary">Execution</Badge>,
  };
  return scopeBadges[scope] || <Badge variant="outline">{scope}</Badge>;
};

const getTypeBadge = (type) => {
  const variants = {
    "STRING": "outline",
    "INTEGER": "secondary", 
    "URL": "success",
    "BOOLEAN": "warning",
    "SECRET": "destructive",
    "JSON": "default",
    "FLOAT": "secondary",
    "FILE_PATH": "outline"
  };
  
  return <Badge variant={variants[type] || "outline"}>{type}</Badge>;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Environment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [showValues, setShowValues] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEnvar, setEditingEnvar] = useState(null);
  const [deletingEnvar, setDeletingEnvar] = useState(null);
  
  // API hooks
  const { data: envarsData, isLoading, error } = useEnvironmentVariables();

  const toggleValueVisibility = (id) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const environmentVariables = envarsData?.data?.items || [];
  
  const filteredVariables = environmentVariables.filter(variable => {
    const matchesSearch = variable.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = scopeFilter === "all" || variable.scope === scopeFilter;
    return matchesSearch && matchesScope;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <PageHeader
          title="Ortam Değişkenleri"
          description="Workflow'larınız ve scriptleriniz için güvenli yapılandırma değişkenlerini yönetin"
          icon={Shield}
          actions={[
            <Button 
              key="new-variable"
              onClick={() => setShowCreateDialog(true)} 
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Değişken
            </Button>
          ]}
        />

        {/* Filters and Search */}
        <Card className="shadow-xl bg-gradient-to-r from-card/90 via-card/80 to-card/70 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Değişkenleri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
              <Select value={scopeFilter} onValueChange={setScopeFilter}>
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kapsamlar</SelectItem>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                  <SelectItem value="WORKFLOW">Workflow</SelectItem>
                  <SelectItem value="EXECUTION">Execution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Variables Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card/90 to-muted/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              Ortam Değişkenleri ({filteredVariables.length})
            </CardTitle>
            <CardDescription className="text-lg">
              Yapılandırma verileri ve gizli bilgiler için güvenli depolama
            </CardDescription>
          </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Ortam değişkenleri yükleniyor...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Ortam değişkenleri yüklenirken bir hata oluştu: {error.message}</p>
            </div>
          ) : filteredVariables.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Henüz ortam değişkeni bulunamadı.</p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Değişkeninizi Oluşturun
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Ad
                      <HelpTooltip content={helpContent.environment.name} iconSize="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Değer
                      <HelpTooltip content="Değişken değeri (göstermek/gizlemek için göz simgesine tıklayın)" iconSize="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Tür
                      <HelpTooltip content={helpContent.environment.type} iconSize="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Kapsam
                      <HelpTooltip content={helpContent.environment.scope} iconSize="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      İşlemler
                      <HelpTooltip content={helpContent.environment.actions} iconSize="w-3 h-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-mono text-sm">{variable.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-48">
                        {variable.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {showValues[variable.id] ? variable.value : '••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleValueVisibility(variable.id)}
                      >
                        {showValues[variable.id] ? 
                          <EyeOff className="w-3 h-3" /> : 
                          <Eye className="w-3 h-3" />
                        }
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(variable.variable_type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getScopeIcon(variable.scope)}
                      {getScopeBadge(variable.scope)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingEnvar(variable.id)}
                        title="Düzenle"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeletingEnvar({ 
                          id: variable.id, 
                          name: variable.name
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
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateEnvironmentDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
      
      <EditEnvironmentDialog 
        open={!!editingEnvar} 
        onOpenChange={(open) => !open && setEditingEnvar(null)}
        envarId={editingEnvar}
      />
      
      <DeleteEnvironmentDialog 
        open={!!deletingEnvar} 
        onOpenChange={(open) => !open && setDeletingEnvar(null)}
        envarId={deletingEnvar?.id}
        envarName={deletingEnvar?.name}
      />
    </div>
  </div>
  );
}