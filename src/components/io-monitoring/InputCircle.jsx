import React from 'react';
import { cn } from '@/lib/utils';
import { Database, FileText, Braces, Type } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getTypeIcon = (dataType) => {
  switch (dataType?.toLowerCase()) {
    case 'json':
    case 'object':
      return Braces;
    case 'string':
    case 'text':
      return Type;
    case 'file':
      return FileText;
    default:
      return Database;
  }
};

const getTypeColor = (dataType) => {
  switch (dataType?.toLowerCase()) {
    case 'json':
    case 'object':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    case 'string':
    case 'text':
      return 'text-green-500 bg-green-500/10 border-green-500/30';
    case 'file':
      return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
  }
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const InputCircle = ({ input, isSelected, onClick }) => {
  const Icon = getTypeIcon(input.data_type);
  const colorClasses = getTypeColor(input.data_type);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => onClick(input)}
          className={cn(
            "relative w-16 h-16 rounded-full border-2 cursor-pointer transition-all duration-200",
            "flex flex-col items-center justify-center gap-1",
            "hover:scale-110 hover:shadow-lg",
            colorClasses,
            isSelected && "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg"
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium">
            {input.node_id.split('_').pop().substring(0, 4)}
          </span>
          
          {/* Size indicator */}
          <div className="absolute -bottom-1 -right-1 bg-background border rounded-full px-1 py-0.5">
            <span className="text-xs text-muted-foreground">
              {formatSize(input.size_bytes)}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div className="space-y-1">
          <div className="font-medium">{input.node_id}</div>
          <div className="text-sm text-muted-foreground">
            Type: {input.data_type} • Size: {formatSize(input.size_bytes)}
          </div>
          <div className="text-sm text-muted-foreground">
            Execution: {input.execution_id}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};