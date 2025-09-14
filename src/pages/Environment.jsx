import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { PageHeader } from "@/components/ui/page-header";
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
  Filter
} from "lucide-react";

// Mock data
const environmentVariables = [
  {
    id: "EV-001",
    name: "DATABASE_URL",
    value: "postgresql://localhost:5432/miniflow",
    description: "Main database connection string",
    type: "URL",
    scope: "GLOBAL",
    created_at: "2024-01-15T10:00:00Z",
    last_accessed_at: "2024-01-15T12:00:00Z",
    access_count: 25,
    last_modified_by: "admin@miniflow.dev"
  },
  {
    id: "EV-002", 
    name: "API_SECRET_KEY",
    value: "sk-1234567890abcdef",
    description: "External API authentication key",
    type: "STRING",
    scope: "USER",
    created_at: "2024-01-14T09:30:00Z",
    last_accessed_at: "2024-01-15T11:45:00Z",
    access_count: 12,
    last_modified_by: "dev@miniflow.dev"
  },
  {
    id: "EV-003",
    name: "MAX_RETRY_COUNT",
    value: "3",
    description: "Maximum number of retries for failed operations",
    type: "INTEGER",
    scope: "GLOBAL",
    created_at: "2024-01-13T14:20:00Z",
    last_accessed_at: "2024-01-15T10:15:00Z",
    access_count: 45,
    last_modified_by: "admin@miniflow.dev"
  },
];

const getScopeIcon = (scope) => {
  switch (scope) {
    case "GLOBAL":
      return <Globe className="w-4 h-4" />;
    case "USER":
      return <User className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getScopeBadge = (scope) => {
  switch (scope) {
    case "GLOBAL":
      return <Badge variant="success">Global</Badge>;
    case "USER":
      return <Badge variant="secondary">User</Badge>;
    default:
      return <Badge variant="outline">{scope}</Badge>;
  }
};

const getTypeBadge = (type) => {
  const variants = {
    "STRING": "outline",
    "INTEGER": "secondary", 
    "URL": "success",
    "BOOLEAN": "warning"
  };
  
  return <Badge variant={variants[type] || "outline"}>{type}</Badge>;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
};

export default function Environment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [showValues, setShowValues] = useState({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const toggleValueVisibility = (id) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVariables = environmentVariables.filter(variable => {
    const matchesSearch = variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = scopeFilter === "all" || variable.scope === scopeFilter;
    return matchesSearch && matchesScope;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Environment Variables"
          description="Manage secure configuration variables for your workflows and scripts"
          icon={Shield}
          actions={[
            <Dialog key="create-dialog" open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  New Variable
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Environment Variable</DialogTitle>
                  <DialogDescription>
                    Add a new environment variable to your MiniFlow workspace
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Variable Name</Label>
                      <Input id="name" placeholder="DATABASE_URL" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STRING">String</SelectItem>
                          <SelectItem value="INTEGER">Integer</SelectItem>
                          <SelectItem value="FLOAT">Float</SelectItem>
                          <SelectItem value="BOOLEAN">Boolean</SelectItem>
                          <SelectItem value="URL">URL</SelectItem>
                          <SelectItem value="JSON">JSON</SelectItem>
                          <SelectItem value="FILE_PATH">File Path</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input id="value" type="password" placeholder="Enter value" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe this variable's purpose" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GLOBAL">Global</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="SESSION">Session</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Variable
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ]}
        />

        {/* Filters and Search */}
        <Card className="shadow-xl bg-gradient-to-r from-card/90 via-card/80 to-card/70 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search variables..."
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
                  <SelectItem value="all">All Scopes</SelectItem>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="SESSION">Session</SelectItem>
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
              Environment Variables ({filteredVariables.length})
            </CardTitle>
            <CardDescription className="text-lg">
              Secure storage for configuration data and secrets
            </CardDescription>
          </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="flex items-center gap-2">
                  Name
                  <HelpTooltip content={helpContent.environment.name} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Value
                  <HelpTooltip content="The variable value (click eye to show/hide)" iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Type
                  <HelpTooltip content={helpContent.environment.type} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Scope
                  <HelpTooltip content={helpContent.environment.scope} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Access Count
                  <HelpTooltip content={helpContent.environment.accessCount} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Last Used
                  <HelpTooltip content={helpContent.environment.lastUsed} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="text-right flex items-center gap-2 justify-end">
                  Actions
                  <HelpTooltip content={helpContent.environment.actions} iconSize="w-3 h-3" />
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
                    {getTypeBadge(variable.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getScopeIcon(variable.scope)}
                      {getScopeBadge(variable.scope)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3" />
                      {variable.access_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(variable.last_accessed_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
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
  </div>
  );
}