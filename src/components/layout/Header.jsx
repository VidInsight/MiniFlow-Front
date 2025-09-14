import { NavLink, useLocation } from "react-router-dom";
import { Bell, Settings, User, LayoutDashboard, Workflow, Code2, Settings2, Upload, Play, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

export const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background/95 via-background to-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MiniFlow
          </h1>
        </div>

        {/* Animated Navigation Tabs - Center */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 backdrop-blur-sm">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105",
                  active 
                    ? "text-primary-foreground bg-primary shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-300",
                  active && "animate-pulse"
                )} />
                <span className="hidden sm:inline-block">{item.name}</span>
                {active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="min-w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl"
            >
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg hover:bg-primary/10 transition-colors">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:bg-primary/10 transition-colors">
                <User className="w-4 h-4 mr-3" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:bg-primary/10 transition-colors">
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};