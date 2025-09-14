import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const HelpTooltip = ({ 
  content, 
  side = 'top', 
  align = 'center',
  className = '',
  iconSize = 'w-4 h-4',
  contentClassName = ''
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm ${className}`}
            aria-label="Help information"
          >
            <HelpCircle className={iconSize} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={`max-w-xs text-sm font-normal ${contentClassName}`}
        >
          <div className="space-y-1">
            {typeof content === 'string' ? (
              <p>{content}</p>
            ) : (
              content
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;