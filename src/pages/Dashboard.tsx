import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Settings2
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const stats = [
  {
    title: "Active Workflows",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: Workflow,
  },
  {
    title: "Scripts Running",
    value: "28",
    change: "+5",
    changeType: "positive" as const,
    icon: Code2,
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+0.3%",
    changeType: "positive" as const,
    icon: CheckCircle2,
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-0.2s",
    changeType: "positive" as const,
    icon: Clock,
  },
];

const recentActivities = [
  {
    id: 1,
    type: "workflow",
    title: "Data Processing Pipeline",
    status: "completed",
    time: "2 minutes ago",
    duration: "45s"
  },
  {
    id: 2,
    type: "script",
    title: "CSV Validator",
    status: "running",
    time: "5 minutes ago",
    duration: "30s"
  },
  {
    id: 3,
    type: "workflow",
    title: "Email Automation",
    status: "failed",
    time: "12 minutes ago",
    duration: "15s"
  },
  {
    id: 4,
    type: "script",
    title: "Database Backup",
    status: "completed",
    time: "1 hour ago",
    duration: "2m 30s"
  },
];

const getStatusBadge = (status: string) => {
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

const getStatusIcon = (status: string) => {
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

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-center">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">MiniFlow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Automate your workflows with powerful visual tools and intelligent execution
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="shadow-soft">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
            <Button variant="outline" size="lg">
              <Code2 className="w-4 h-4 mr-2" />
              New Script
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1 text-success" />
                <span className="text-success">{stat.change}</span>
                <span className="ml-1">from last hour</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest workflow and script executions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.duration}</span>
                  </div>
                </div>
                {getStatusBadge(activity.status)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Workflow className="w-4 h-4 mr-3" />
              Create New Workflow
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Code2 className="w-4 h-4 mr-3" />
              Upload Script
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Settings2 className="w-4 h-4 mr-3" />
              Manage Environment Variables
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Play className="w-4 h-4 mr-3" />
              View Execution Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}