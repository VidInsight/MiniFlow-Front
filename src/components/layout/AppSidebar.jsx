import { NavLink, useLocation } from "react-router-dom";
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
  GitBranch,
  Upload,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    name: "Scripts",
    href: "/scripts",
    icon: Code2,
  },
  {
    name: "Environment",
    href: "/environment",
    icon: Settings2,
  },
  {
    name: "Files",
    href: "/files",
    icon: Upload,
  },
  {
    name: "Executions",
    href: "/executions",
    icon: Play,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
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

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r bg-sidebar" collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
            </div>
            {open && (
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MiniFlow
              </h1>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <NavLink to={item.href} end={item.href === "/"}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)}
                    tooltip={item.name}
                  >
                    <NavLink to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Collapse Button */}
      <SidebarFooter>
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className={cn(
              "w-full justify-start gap-2",
              !open && "justify-center"
            )}
          >
            {open ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Status */}
        <div className="p-2 border-t border-sidebar-border">
          {open ? (
            <>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>System healthy</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Last sync: 2 minutes ago
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}