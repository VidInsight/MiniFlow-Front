import { Palette, Zap, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const themeVariants = [
  {
    id: 'default',
    name: 'Tech Blue',
    icon: Zap,
    colors: {
      primary: '220 91% 65%',
      secondary: '280 60% 65%',
      accent: '200 95% 58%'
    }
  },
  {
    id: 'creative',
    name: 'Creative Purple',
    icon: Sparkles,
    colors: {
      primary: '280 60% 65%',
      secondary: '320 70% 65%',
      accent: '200 95% 58%'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    icon: Eye,
    colors: {
      primary: '0 0% 20%',
      secondary: '0 0% 40%',
      accent: '220 91% 65%'
    }
  },
];

export function ThemeVariantSelector() {
  const [currentVariant, setCurrentVariant] = useState('default');

  const applyThemeVariant = (variant) => {
    const root = document.documentElement;
    const colors = variant.colors;
    
    // Apply custom properties
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--interactive-primary', colors.primary);
    root.style.setProperty('--glow-primary', colors.primary);
    root.style.setProperty('--glow-secondary', colors.secondary);
    
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${colors.primary}), hsl(${colors.secondary}))`);
    root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, hsl(${colors.accent}), hsl(${colors.primary}))`);
    
    setCurrentVariant(variant.id);
    localStorage.setItem('theme-variant', variant.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Select theme variant</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Theme Variants</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeVariants.map((variant) => {
          const Icon = variant.icon;
          return (
            <DropdownMenuItem 
              key={variant.id}
              onClick={() => applyThemeVariant(variant)} 
              className="flex items-center gap-3"
            >
              <Icon className="h-4 w-4" />
              <span>{variant.name}</span>
              {currentVariant === variant.id && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}