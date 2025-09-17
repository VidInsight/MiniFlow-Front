import { NavLink, useLocation } from "react-router-dom";
import { Bell, Settings, User, LayoutDashboard, Workflow, Code2, Settings2, Upload, Play, BarChart3, Activity } from "lucide-react";
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
    name: "I/O Monitor",
    href: "/execution-io",
    icon: Activity,
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
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-primary/5">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VIDINSIGHT
          </h1>
        </div>

        {/* Navigation Tabs - Center */}
        <nav className="flex items-center gap-2 bg-muted/20 rounded-2xl p-1.5 backdrop-blur-sm border border-border/30">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={cn(
                  "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-md",
                  active 
                    ? "text-primary-foreground bg-gradient-primary shadow-lg shadow-primary/25 border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50 hover:shadow-sm"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-300",
                  active ? "drop-shadow-sm" : ""
                )} />
                <span className="hidden lg:inline-block whitespace-nowrap">{item.name}</span>
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-10 blur-xl" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />

          <Button
            variant="ghost" 
            size="sm"
            className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300 relative"
          >
            <Bell className="w-4 h-4" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300 ring-2 ring-transparent hover:ring-primary/20"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="min-w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl p-2"
            >
              <DropdownMenuLabel className="font-semibold text-base px-3 py-2">Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="rounded-xl hover:bg-primary/10 transition-colors p-3 cursor-pointer">
                <Settings className="w-4 h-4 mr-3" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl hover:bg-primary/10 transition-colors p-3 cursor-pointer">
                <User className="w-4 h-4 mr-3" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl hover:bg-primary/10 transition-colors p-3 cursor-pointer">
                Fatura
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="rounded-xl hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors p-3 cursor-pointer">
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};