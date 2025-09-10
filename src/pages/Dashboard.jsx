import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { helpContent } from "@/data/help-content";
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Play,
  Plus,
  Workflow,
  Code2,
  Settings2,
  ChevronDown,
  ChevronRight,
  Eye
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import heroImage from "@/assets/hero-dashboard.jpg";

const stats = [
  {
    title: "Active Workflows",
    value: "12",
    change: "+2",
    changeType: "positive",
    icon: Workflow,
  },
  {
    title: "Scripts Running",
    value: "28",
    change: "+5",
    changeType: "positive",
    icon: Code2,
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+0.3%",
    changeType: "positive",
    icon: CheckCircle2,
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-0.2s",
    changeType: "positive",
    icon: Clock,
  },
];

const recentActivities = [
  {
    id: 1,
    type: "workflow",
    title: "Data Processing Pipeline",
    description: "Automated CSV processing with data validation and transformation",
    status: "completed",
    time: "2 minutes ago",
    duration: "45s",
    priority: "high",
    executions: [
      { id: "EX-001", name: "Pipeline Run #127", status: "completed", executedNodes: 8, totalNodes: 8, progress: 100 },
      { id: "EX-002", name: "Pipeline Run #126", status: "completed", executedNodes: 8, totalNodes: 8, progress: 100 },
      { id: "EX-003", name: "Pipeline Run #125", status: "failed", executedNodes: 5, totalNodes: 8, progress: 62 },
      { id: "EX-004", name: "Pipeline Run #124", status: "completed", executedNodes: 8, totalNodes: 8, progress: 100 },
      { id: "EX-005", name: "Pipeline Run #123", status: "completed", executedNodes: 8, totalNodes: 8, progress: 100 }
    ]
  },
  {
    id: 2,
    type: "script",
    title: "CSV Validator",
    description: "Validates CSV file structure and data integrity checks",
    status: "running",
    time: "5 minutes ago",
    duration: "30s",
    priority: "medium",
    executions: [
      { id: "EX-006", name: "Validation Run #89", status: "running", executedNodes: 3, totalNodes: 5, progress: 60 },
      { id: "EX-007", name: "Validation Run #88", status: "completed", executedNodes: 5, totalNodes: 5, progress: 100 },
      { id: "EX-008", name: "Validation Run #87", status: "completed", executedNodes: 5, totalNodes: 5, progress: 100 },
      { id: "EX-009", name: "Validation Run #86", status: "failed", executedNodes: 2, totalNodes: 5, progress: 40 },
      { id: "EX-010", name: "Validation Run #85", status: "completed", executedNodes: 5, totalNodes: 5, progress: 100 }
    ]
  },
  {
    id: 3,
    type: "workflow",
    title: "Email Automation",
    description: "Sends automated email notifications with template processing",
    status: "failed",
    time: "12 minutes ago",
    duration: "15s",
    priority: "high",
    executions: [
      { id: "EX-011", name: "Email Campaign #45", status: "failed", executedNodes: 2, totalNodes: 6, progress: 33 },
      { id: "EX-012", name: "Email Campaign #44", status: "completed", executedNodes: 6, totalNodes: 6, progress: 100 },
      { id: "EX-013", name: "Email Campaign #43", status: "completed", executedNodes: 6, totalNodes: 6, progress: 100 },
      { id: "EX-014", name: "Email Campaign #42", status: "completed", executedNodes: 6, totalNodes: 6, progress: 100 },
      { id: "EX-015", name: "Email Campaign #41", status: "failed", executedNodes: 3, totalNodes: 6, progress: 50 }
    ]
  },
  {
    id: 4,
    type: "script",
    title: "Database Backup",
    description: "Creates automated database backups with compression and archiving",
    status: "completed",
    time: "1 hour ago",
    duration: "2m 30s",
    priority: "low",
    executions: [
      { id: "EX-016", name: "Backup Job #12", status: "completed", executedNodes: 3, totalNodes: 3, progress: 100 },
      { id: "EX-017", name: "Backup Job #11", status: "completed", executedNodes: 3, totalNodes: 3, progress: 100 },
      { id: "EX-018", name: "Backup Job #10", status: "completed", executedNodes: 3, totalNodes: 3, progress: 100 },
      { id: "EX-019", name: "Backup Job #9", status: "completed", executedNodes: 3, totalNodes: 3, progress: 100 },
      { id: "EX-020", name: "Backup Job #8", status: "completed", executedNodes: 3, totalNodes: 3, progress: 100 }
    ]
  },
  {
    id: 5,
    type: "workflow",
    title: "Report Generation",
    description: "Generates daily analytics reports and distributes to stakeholders",
    status: "completed",
    time: "2 hours ago",
    duration: "1m 15s",
    priority: "medium",
    executions: [
      { id: "EX-021", name: "Daily Report #156", status: "completed", executedNodes: 4, totalNodes: 4, progress: 100 },
      { id: "EX-022", name: "Daily Report #155", status: "completed", executedNodes: 4, totalNodes: 4, progress: 100 },
      { id: "EX-023", name: "Daily Report #154", status: "pending", executedNodes: 1, totalNodes: 4, progress: 25 },
      { id: "EX-024", name: "Daily Report #153", status: "completed", executedNodes: 4, totalNodes: 4, progress: 100 },
      { id: "EX-025", name: "Daily Report #152", status: "completed", executedNodes: 4, totalNodes: 4, progress: 100 }
    ]
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "running":
      return <Badge variant="secondary">Running</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "running":
      return <Play className="w-4 h-4 text-secondary" />;
    case "failed":
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const getExecutionStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return <Badge variant="success" className="text-xs">Completed</Badge>;
    case "running":
      return <Badge variant="secondary" className="text-xs">Running</Badge>;
    case "failed":
      return <Badge variant="destructive" className="text-xs">Failed</Badge>;
    case "pending":
      return <Badge variant="warning" className="text-xs">Pending</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

export default function Dashboard() {
  const userName = "John Doe"; // This would come from user context/auth
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (workflowId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto space-y-8 p-6">
        {/* Personalized Greeting */}
        <div className="text-center space-y-4 py-8">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold tracking-tight">
              Welcome back, 
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent animate-pulse">
                {userName}
              </span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Here's what's happening with your workflows today
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full"></div>
        </div>

        {/* Daily Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Execution Count
                <HelpTooltip content={helpContent.dashboard.executionCount.content} />
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">47</div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-success mr-1" />
                <span className="text-success font-medium">+12</span>
                <span className="text-muted-foreground ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-success/5 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Successful
                <HelpTooltip content={helpContent.dashboard.successful.content} />
              </CardTitle>
              <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-success">42</div>
              <div className="flex items-center mt-2 text-xs">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
                <span className="text-success font-medium">89.4%</span>
                <span className="text-muted-foreground ml-1">success rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-destructive/5 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Failed
                <HelpTooltip content={helpContent.dashboard.failed.content} />
              </CardTitle>
              <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-destructive">3</div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-success mr-1 rotate-180" />
                <span className="text-success font-medium">-2</span>
                <span className="text-muted-foreground ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-warning/5 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Canceled
                <HelpTooltip content={helpContent.dashboard.canceled.content} />
              </CardTitle>
              <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-warning">2</div>
              <div className="flex items-center mt-2 text-xs">
                <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
                <span className="text-muted-foreground font-medium">Same as yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Bar */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-card via-card/50 to-card shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              Quick Actions
              <HelpTooltip content={helpContent.dashboard.quickActions.content} />
            </CardTitle>
            <CardDescription className="text-lg">
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative w-full">
                <Button size="lg" className="w-full h-20 flex-col gap-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <Workflow className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">Create Workflow</span>
                </Button>
                <div className="absolute -top-2 -right-2">
                  <HelpTooltip content={helpContent.dashboard.createWorkflow.content} side="top" />
                </div>
              </div>
              <div className="relative w-full">
                <Button variant="outline" size="lg" className="w-full h-20 flex-col gap-3 border-2 hover:border-primary hover:bg-primary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <Settings2 className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold">Environment Variable</span>
                </Button>
                <div className="absolute -top-2 -right-2">
                  <HelpTooltip content={helpContent.dashboard.environmentVariable.content} side="top" />
                </div>
              </div>
              <div className="relative w-full">
                <Button variant="outline" size="lg" className="w-full h-20 flex-col gap-3 border-2 hover:border-success hover:bg-success/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <Code2 className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Create Script</span>
                </Button>
                <div className="absolute -top-2 -right-2">
                  <HelpTooltip content={helpContent.dashboard.createScript.content} side="top" />
                </div>
              </div>
              <div className="relative w-full">
                <Button variant="outline" size="lg" className="w-full h-20 flex-col gap-3 border-2 hover:border-warning hover:bg-warning/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <Plus className="w-8 h-8 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="font-semibold">Upload File</span>
                </Button>
                <div className="absolute -top-2 -right-2">
                  <HelpTooltip content={helpContent.dashboard.uploadFile.content} side="top" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Executed Workflows */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card/90 to-muted/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5 opacity-50"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-success/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              Latest Executions
            </CardTitle>
            <CardDescription className="text-lg">
              Recent workflow executions and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {recentActivities.map((workflow) => (
              <Collapsible key={workflow.id} open={openDropdowns[workflow.id]} onOpenChange={() => toggleDropdown(workflow.id)}>
                <div className="group p-6 rounded-xl bg-gradient-to-r from-background via-background/90 to-background/80 border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0 rounded-xl hover:bg-primary/10 transition-colors group-hover:scale-110">
                        {openDropdowns[workflow.id] ? 
                          <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300" /> : 
                          <ChevronRight className="w-5 h-5 text-primary transition-transform duration-300" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">{workflow.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {workflow.description || `Automated ${workflow.type} execution with monitoring and notifications`}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-primary/10">
                            <Clock className="w-3 h-3 text-primary" />
                          </div>
                          <span>Executed {workflow.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-success/10">
                            <TrendingUp className="w-3 h-3 text-success" />
                          </div>
                          <span>Duration: {workflow.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-warning/10">
                            <Play className="w-3 h-3 text-warning" />
                          </div>
                          <span className="font-mono text-xs">ID: WF-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CollapsibleContent className="space-y-2 mt-4 ml-14">
                  <div className="bg-gradient-to-br from-background to-muted/20 border border-border/50 rounded-xl p-6 shadow-inner">
                    <h5 className="font-bold text-base mb-4 text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      Latest Executions
                    </h5>
                    <div className="space-y-4">
                      {workflow.executions.map((execution) => (
                        <div key={execution.id} className="group/execution p-4 bg-gradient-to-r from-card to-card/80 border border-border/30 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-sm text-foreground group-hover/execution:text-primary transition-colors duration-300">{execution.name}</span>
                                {getExecutionStatusBadge(execution.status)}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="font-medium">Progress: {execution.executedNodes}/{execution.totalNodes} nodes</span>
                                  <span className="font-bold text-primary">{execution.progress}%</span>
                                </div>
                                <div className="relative">
                                  <Progress value={execution.progress} className="h-2 bg-muted/50 rounded-full overflow-hidden" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-success/20 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:scale-110 transition-all duration-300 group-hover/execution:border-primary/30"
                                onClick={() => {
                                  // Navigate to execution details page
                                  window.location.href = `/executions/${execution.id}`;
                                }}
                              >
                                <Eye className="w-4 h-4 text-primary" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}