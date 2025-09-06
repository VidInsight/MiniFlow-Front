import { useState } from "react";
import { Bell, Search, Settings, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background/95 via-background to-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center justify-end px-6 gap-6">
        {/* Search */}
        <div className="w-80">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              placeholder="Search workflows, scripts, variables..."
              className="pl-12 h-10 bg-background/60 border-border/50 rounded-xl hover:border-primary/30 focus:border-primary/50 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

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