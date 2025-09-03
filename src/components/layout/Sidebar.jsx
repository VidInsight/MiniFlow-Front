import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Workflow, 
  Code2, 
  Settings2, 
  Play, 
  Database,
  BarChart3,
  Zap,
  FileText,
  GitBranch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: Workflow,
    badge: "12",
  },
  {
    name: "Scripts",
    href: "/scripts",
    icon: Code2,
    badge: "28",
  },
  {
    name: "Environment",
    href: "/environment",
    icon: Settings2,
    badge: null,
  },
  {
    name: "Executions",
    href: "/executions",
    icon: Play,
    badge: "Active",
    badgeVariant: "success",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
  },
];

const quickActions = [
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Zap,
  },
  {
    name: "Version Control",
    href: "/versions",
    icon: GitBranch,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Main
            </h2>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badgeVariant || "secondary"} 
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h2>
            {quickActions.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>System healthy</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Last sync: 2 minutes ago
          </div>
        </div>
      </div>
    </aside>
  );
};