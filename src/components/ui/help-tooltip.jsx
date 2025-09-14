import * as React from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const HelpTooltip = React.forwardRef(({ 
  content, 
  side = "right", 
  className,
  iconSize = "w-4 h-4",
  ...props 
}, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            className={cn(
              "inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              className
            )}
            type="button"
            aria-label="Help information"
            {...props}
          >
            <HelpCircle className={cn(iconSize)} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-xs text-sm p-3 bg-popover text-popover-foreground border shadow-md"
        >
          {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

HelpTooltip.displayName = "HelpTooltip";

export { HelpTooltip };