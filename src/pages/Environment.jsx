import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Settings, Globe, Server, Lock, Key, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/ui/page-header";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { toast } from "@/hooks/use-toast";
import { CreateEnvironmentDialog } from "@/components/environment/CreateEnvironmentDialog";
import { EditEnvironmentDialog } from "@/components/environment/EditEnvironmentDialog";
import { environmentService } from "@/services/environmentService";

// Helper functions
const getScopeIcon = (scope) => {
  switch (scope?.toLowerCase()) {
    case 'global': return Globe;
    case 'project': return Server;
    case 'environment': return Settings;
    default: return Globe;
  }
};

const getScopeBadge = (scope) => {
  const variants = {
    'GLOBAL': 'default',
    'PROJECT': 'destructive', 
    'ENVIRONMENT': 'secondary'
  };
  return <Badge variant={variants[scope] || 'default'}>{scope}</Badge>;
};

const getTypeBadge = (type) => {
  const variants = {
    'SECRET': 'destructive',
    'CONFIG': 'secondary',
    'API_KEY': 'default'
  };
  const icons = {
    'SECRET': Lock,
    'CONFIG': Settings,
    'API_KEY': Key
  };
  const Icon = icons[type] || Key;
  
  return (
    <Badge variant={variants[type] || 'default'} className="gap-1">
      <Icon className="w-3 h-3" />
      {type}
    </Badge>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};

export default function Environment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [visibleValues, setVisibleValues] = useState(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEnvVar, setSelectedEnvVar] = useState(null);

  const queryClient = useQueryClient();

  // Fetch environment variables
  const { data: envVarsData, isLoading, error } = useQuery({
    queryKey: ['environmentVariables'],
    queryFn: environmentService.getAll,
  });

  const environmentVariables = envVarsData?.data?.items || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: environmentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['environmentVariables']);
      toast({
        title: "Success",
        description: data.message || "Environment variable created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create environment variable",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => environmentService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['environmentVariables']);
      toast({
        title: "Success",
        description: data.message || "Environment variable updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update environment variable",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: environmentService.delete,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['environmentVariables']);
      toast({
        title: "Success",
        description: data.message || "Environment variable deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.response?.data?.message || "Failed to delete environment variable",
        variant: "destructive",
      });
    },
  });

  const toggleValueVisibility = (id) => {
    const newVisible = new Set(visibleValues);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleValues(newVisible);
  };

  const handleCreate = async (values) => {
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (id, values) => {
    await updateMutation.mutateAsync({ id, data: values });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this environment variable?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (envVar) => {
    setSelectedEnvVar(envVar);
    setIsEditDialogOpen(true);
  };

  // Filter environment variables based on search term and scope
  const filteredVariables = environmentVariables.filter(envVar => {
    const matchesSearch = envVar.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         envVar.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScope = scopeFilter === "all" || envVar.scope?.toLowerCase() === scopeFilter.toLowerCase();
    
    return matchesSearch && matchesScope;
  });

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Environment Variables"
          description="Manage environment variables and configuration settings"
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Failed to load environment variables: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Environment Variables"
        description="Manage environment variables and configuration settings"
        action={
          <div className="flex items-center gap-2">
            <HelpTooltip content="environment" />
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Variable
            </Button>
          </div>
        }
      />

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search environment variables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={scopeFilter} onValueChange={setScopeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scopes</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Access Count</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading environment variables...
                  </TableCell>
                </TableRow>
              ) : filteredVariables.length > 0 ? (
                filteredVariables.map((envVar) => (
                  <TableRow key={envVar.id}>
                    <TableCell className="font-mono font-medium">
                      <div className="flex items-center gap-2">
                        <span>{envVar.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleValueVisibility(envVar.id)}
                          className="h-6 w-6 p-0"
                        >
                          {visibleValues.has(envVar.id) ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      {visibleValues.has(envVar.id) && (
                        <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
                          {envVar.value}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {envVar.description}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(envVar.variable_type)}
                    </TableCell>
                    <TableCell>
                      {getScopeBadge(envVar.scope)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(envVar.access_count || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(envVar.last_accessed_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(envVar)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(envVar.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {searchTerm || scopeFilter !== "all" ? "No environment variables found matching your filters" : "No environment variables created yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateEnvironmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreate}
      />

      <EditEnvironmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        envVar={selectedEnvVar}
        onSuccess={handleUpdate}
      />
    </div>
  );
}