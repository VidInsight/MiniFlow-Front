import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
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
import { PageHeader } from "@/components/ui/page-header";
import { 
  Plus, 
  Search, 
  Save,
  Play,
  Workflow,
  Filter,
  Settings,
  Database,
  Mail,
  FileText,
  Clock,
  Zap,
  Info,
  Edit,
  Trash2,
  BarChart3
} from "lucide-react";

// Initial nodes and edges for the workflow builder
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Trigger',
      description: 'Workflow Start'
    },
    position: { x: 100, y: 100 },
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '2px solid hsl(var(--primary))',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: '2',
    data: { 
      label: 'Process CSV',
      description: 'Data Processing'
    },
    position: { x: 350, y: 100 },
    style: {
      background: 'hsl(var(--success))',
      color: 'hsl(var(--success-foreground))',
      border: '2px solid hsl(var(--success))',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: '3',
    data: { 
      label: 'Send Email',
      description: 'Notification'
    },
    position: { x: 600, y: 100 },
    style: {
      background: 'hsl(var(--warning))',
      color: 'hsl(var(--warning-foreground))',
      border: '2px solid hsl(var(--warning))',
      borderRadius: '8px',
      width: 180,
    },
  },
  {
    id: '4',
    type: 'output',
    data: { 
      label: 'Complete',
      description: 'Workflow End'
    },
    position: { x: 850, y: 100 },
    style: {
      background: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      border: '2px solid hsl(var(--secondary))',
      borderRadius: '8px',
      width: 180,
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: { stroke: 'hsl(var(--success))' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    style: { stroke: 'hsl(var(--warning))' },
  },
];

// Mock workflow data
const workflows = [
  {
    id: "WF-001",
    name: "Data Processing Pipeline",
    description: "Automated CSV processing with email notifications and data transformation",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    last_run: "2024-01-15T14:30:00Z",
    success_rate: 96.7,
    total_runs: 150,
    nodes_count: 5,
    category: "data_processing",
    avg_duration: "2m 15s"
  },
  {
    id: "WF-002", 
    name: "Email Campaign",
    description: "Automated email marketing workflow with analytics and customer segmentation",
    status: "active",
    created_at: "2024-01-12T09:15:00Z",
    last_run: "2024-01-15T12:45:00Z",
    success_rate: 98.2,
    total_runs: 89,
    nodes_count: 8,
    category: "communication",
    avg_duration: "1m 30s"
  },
  {
    id: "WF-003",
    name: "Database Maintenance",
    description: "Scheduled database cleanup and optimization tasks",
    status: "deactivated",
    created_at: "2024-01-10T11:45:00Z",
    last_run: "2024-01-14T02:00:00Z",
    success_rate: 100.0,
    total_runs: 12,
    nodes_count: 3,
    category: "maintenance",
    avg_duration: "5m 45s"
  },
  {
    id: "WF-004",
    name: "Report Generation",
    description: "Daily analytics reports with automated distribution to stakeholders",
    status: "draft",
    created_at: "2024-01-20T15:30:00Z",
    last_run: null,
    success_rate: 0,
    total_runs: 0,
    nodes_count: 6,
    category: "reporting",
    avg_duration: "N/A"
  },
  {
    id: "WF-005",
    name: "User Onboarding",
    description: "Welcome email sequence and account setup automation for new users",
    status: "active", 
    created_at: "2024-01-18T11:20:00Z",
    last_run: "2024-01-20T09:15:00Z",
    success_rate: 94.5,
    total_runs: 67,
    nodes_count: 4,
    category: "communication",
    avg_duration: "45s"
  }
];

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return <Badge variant="success" className="font-medium">Active</Badge>;
    case "draft":
      return <Badge variant="secondary" className="font-medium">Draft</Badge>;
    case "deactivated":
      return <Badge variant="destructive" className="font-medium">Deactivated</Badge>;
    case "paused":
      return <Badge variant="warning" className="font-medium">Paused</Badge>;
    case "failed":
      return <Badge variant="destructive" className="font-medium">Failed</Badge>;
    default:
      return <Badge variant="outline" className="font-medium">{status}</Badge>;
  }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "data_processing":
      return <Database className="w-4 h-4" />;
    case "communication":
      return <Mail className="w-4 h-4" />;
    case "maintenance":
      return <Settings className="w-4 h-4" />;
    default:
      return <Workflow className="w-4 h-4" />;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
};

export default function Workflows() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBuilder, setShowBuilder] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (showBuilder) {
    return (
      <div className="h-[calc(100vh-12rem)] space-y-4">
        {/* Builder Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
            <p className="text-muted-foreground">Drag and drop to create your automation workflow</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBuilder(false)}>
              Back to List
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Test Run
            </Button>
          </div>
        </div>

        {/* Workflow Builder */}
        <Card className="h-full shadow-soft">
          <CardContent className="p-0 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-muted/20"
            >
              <Controls className="shadow-soft" />
              <MiniMap 
                className="shadow-soft"
                nodeColor="#hsl(var(--primary))"
                maskColor="hsl(var(--muted) / 0.8)"
              />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1}
                color="hsl(var(--muted-foreground) / 0.3)"
              />
            </ReactFlow>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Workflows"
          description="Create, manage, and monitor your automation workflows"
          icon={Workflow}
          actions={[
            <Button 
              key="templates"
              variant="outline" 
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:scale-105 transition-all duration-300 shadow-soft"
            >
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>,
            <Button 
              key="new-workflow"
              onClick={() => setShowBuilder(true)} 
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
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
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

      {/* Workflows List */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-card via-card/90 to-muted/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Workflow className="w-6 h-6 text-primary" />
              </div>
              Workflows ({filteredWorkflows.length})
            </CardTitle>
            <HelpTooltip content={helpContent.workflows.totalWorkflows} />
          </div>
          <CardDescription className="text-lg">
            Manage your automation workflows with detailed insights and controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div 
              key={workflow.id} 
              className="group p-6 rounded-xl bg-gradient-to-r from-background via-background/95 to-background/90 border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                {/* Left Section - Main Info */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  {/* Category Icon */}
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300">
                    {getCategoryIcon(workflow.category)}
                  </div>
                  
                  {/* Name and Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                        {workflow.name}
                      </h3>
                      {getStatusBadge(workflow.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {workflow.description}
                    </p>
                  </div>
                </div>

                {/* Middle Section - Stats */}
                <div className="hidden lg:flex items-center gap-8 px-6">
                  <div className="text-center relative">
                    <div className="text-lg font-bold text-success">{workflow.success_rate}%</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      Success Rate
                      <HelpTooltip content="Percentage of successful workflow runs" iconSize="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-center relative">
                    <div className="text-lg font-bold text-primary">{workflow.total_runs}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      Total Runs
                      <HelpTooltip content="Number of times this workflow has been executed" iconSize="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-center relative">
                    <div className="text-lg font-bold text-warning">{workflow.nodes_count}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      Nodes
                      <HelpTooltip content="Number of processing nodes in this workflow" iconSize="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-center relative">
                    <div className="text-lg font-bold text-secondary">{workflow.avg_duration}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      Avg Duration
                      <HelpTooltip content="Average execution time for this workflow" iconSize="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                    title="View Info"
                  >
                    <Info className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl hover:bg-success/10 hover:scale-110 transition-all duration-300"
                    onClick={() => setShowBuilder(true)}
                    title="Edit Workflow"
                  >
                    <Edit className="w-4 h-4 text-success" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl hover:bg-warning/10 hover:scale-110 transition-all duration-300"
                    disabled={workflow.status === 'draft' || workflow.status === 'deactivated'}
                    title="Run Workflow"
                  >
                    <Play className="w-4 h-4 text-warning" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:scale-110 transition-all duration-300"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Mobile Stats - Visible only on smaller screens */}
              <div className="lg:hidden mt-4 pt-4 border-t border-border/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm font-bold text-success">{workflow.success_rate}%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">{workflow.total_runs}</div>
                    <div className="text-xs text-muted-foreground">Total Runs</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-warning">{workflow.nodes_count}</div>
                    <div className="text-xs text-muted-foreground">Nodes</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">{workflow.avg_duration}</div>
                    <div className="text-xs text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
  );
}