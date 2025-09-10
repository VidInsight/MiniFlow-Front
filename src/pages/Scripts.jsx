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
  Play,
  Code2,
  Clock,
  Filter,
  FileText,
  BarChart3,
  CheckCircle2,
  Tag
} from "lucide-react";

// Mock data
const scripts = [
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
    avg_execution_time: 2.5,
    success_rate: 96.7,
    total_executions: 150,
    tags: ["csv", "data", "processing", "validation"],
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
    avg_execution_time: 1.8,
    success_rate: 98.2,
    total_executions: 89,
    tags: ["email", "notification", "template"],
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
    avg_execution_time: 45.2,
    success_rate: 100.0,
    total_executions: 12,
    tags: ["backup", "database", "maintenance"],
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || script.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Scripts Library"
          description="Manage and execute your automation scripts with performance monitoring"
          icon={Code2}
          actions={[
            <Button 
              key="import"
              variant="outline"
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:scale-105 transition-all duration-300 shadow-soft"
            >
              <FileText className="w-4 h-4 mr-2" />
              Import Script
            </Button>,
            <Dialog key="create-dialog" open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  New Script
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Script</DialogTitle>
                  <DialogDescription>
                    Add a new automation script to your library
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="script-name">Script Name</Label>
                      <Input id="script-name" placeholder="csv_processor" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input id="version" placeholder="1.0.0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="data_processing">Data Processing</SelectItem>
                          <SelectItem value="communication">Communication</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="validation">Validation</SelectItem>
                          <SelectItem value="integration">Integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input id="subcategory" placeholder="etl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe what this script does..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="csv, data, processing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Script Content</Label>
                    <Textarea 
                      id="code" 
                      placeholder="def main():\n    # Your script code here\n    pass"
                      className="font-mono text-sm min-h-48"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Script
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
                  placeholder="Search scripts by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="data_processing">Data Processing</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                </SelectContent>
              </Select>
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
              Scripts ({filteredScripts.length})
            </CardTitle>
            <CardDescription className="text-lg">
              Automation scripts with performance metrics and execution history
            </CardDescription>
          </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="flex items-center gap-2">
                  Script
                  <HelpTooltip content={helpContent.scripts.name} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Category
                  <HelpTooltip content="Script category and programming language" iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Performance
                  <HelpTooltip content="Success rate, average execution time, and total runs" iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Version
                  <HelpTooltip content="Current script version number" iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Size
                  <HelpTooltip content="Script file size in bytes/KB/MB" iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  Last Updated
                  <HelpTooltip content={helpContent.scripts.lastModified} iconSize="w-3 h-3" />
                </TableHead>
                <TableHead className="text-right flex items-center gap-2 justify-end">
                  Actions
                  <HelpTooltip content={helpContent.scripts.actions} iconSize="w-3 h-3" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScripts.map((script) => (
                <TableRow key={script.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium text-sm">{script.name}</span>
                          {getExtensionBadge(script.file_extension)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {script.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {script.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {script.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{script.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(script.category)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        <span>{script.success_rate}% success</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{script.avg_execution_time}s avg</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {script.total_executions} executions
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{script.version}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatFileSize(script.file_size)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(script.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-3 h-3" />
                      </Button>
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