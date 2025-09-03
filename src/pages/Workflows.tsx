import { useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Zap
} from "lucide-react";

// Initial nodes and edges for the workflow builder
const initialNodes: Node[] = [
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

const initialEdges: Edge[] = [
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
    description: "Automated CSV processing with email notifications",
    status: "running",
    created_at: "2024-01-15T10:00:00Z",
    last_run: "2024-01-15T14:30:00Z",
    success_rate: 96.7,
    total_runs: 150,
    nodes_count: 5,
    category: "data_processing"
  },
  {
    id: "WF-002", 
    name: "Email Campaign",
    description: "Automated email marketing workflow with analytics",
    status: "active",
    created_at: "2024-01-12T09:15:00Z",
    last_run: "2024-01-15T12:45:00Z",
    success_rate: 98.2,
    total_runs: 89,
    nodes_count: 8,
    category: "communication"
  },
  {
    id: "WF-003",
    name: "Database Maintenance",
    description: "Scheduled database cleanup and optimization",
    status: "paused",
    created_at: "2024-01-10T11:45:00Z",
    last_run: "2024-01-14T02:00:00Z",
    success_rate: 100.0,
    total_runs: 12,
    nodes_count: 3,
    category: "maintenance"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "running":
      return <Badge variant="success">Running</Badge>;
    case "active":
      return <Badge variant="secondary">Active</Badge>;
    case "paused":
      return <Badge variant="warning">Paused</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getCategoryIcon = (category: string) => {
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
};

export default function Workflows() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBuilder, setShowBuilder] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and monitor your automation workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setShowBuilder(true)} className="shadow-soft">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Workflow className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Running Now</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Play className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.3%</p>
              </div>
              <Zap className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">251</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(workflow.category)}
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                </div>
                {getStatusBadge(workflow.status)}
              </div>
              <CardDescription className="line-clamp-2">
                {workflow.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-medium">{workflow.success_rate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Runs</p>
                  <p className="font-medium">{workflow.total_runs}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nodes</p>
                  <p className="font-medium">{workflow.nodes_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Run</p>
                  <p className="font-medium text-xs">{formatDate(workflow.last_run)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowBuilder(true)}>
                  <Settings className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}