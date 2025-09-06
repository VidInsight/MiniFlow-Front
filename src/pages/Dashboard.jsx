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

export default function Dashboard() {
  const userName = "John Doe"; // This would come from user context/auth
  
  return (
    <div className="space-y-8">
      {/* Personalized Greeting */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">
          Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Here's what's happening with your workflows today
        </p>
      </div>

      {/* Daily Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Execution Count
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">42</div>
            <p className="text-xs text-muted-foreground">
              89.4% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">
              -2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canceled
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground">
              Same as yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Bar */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button size="lg" className="h-16 flex-col gap-2 shadow-soft">
              <Workflow className="w-6 h-6" />
              <span>Create Workflow</span>
            </Button>
            <Button variant="outline" size="lg" className="h-16 flex-col gap-2">
              <Settings2 className="w-6 h-6" />
              <span>Create Environment Variable</span>
            </Button>
            <Button variant="outline" size="lg" className="h-16 flex-col gap-2">
              <Code2 className="w-6 h-6" />
              <span>Create Script</span>
            </Button>
            <Button variant="outline" size="lg" className="h-16 flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span>Upload File</span>
            </Button>
          </div>
        </CardContent>
      </Card>


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