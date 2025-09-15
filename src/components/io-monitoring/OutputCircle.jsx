import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getStatusIcon = (success, errorMessage) => {
  if (success === true) return CheckCircle;
  if (success === false) return XCircle;
  if (errorMessage) return AlertTriangle;
  return Clock;
};

const getStatusColor = (success, errorMessage) => {
  if (success === true) {
    return 'text-green-500 bg-green-500/10 border-green-500/30';
  }
  if (success === false || errorMessage) {
    return 'text-red-500 bg-red-500/10 border-red-500/30';
  }
  return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
};

const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const OutputCircle = ({ output, isSelected, onClick }) => {
  const Icon = getStatusIcon(output.success, output.error_message);
  const colorClasses = getStatusColor(output.success, output.error_message);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => onClick(output)}
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
            {output.node_id.split('_').pop().substring(0, 4)}
          </span>
          
          {/* Duration indicator */}
          <div className="absolute -bottom-1 -right-1 bg-background border rounded-full px-1 py-0.5">
            <span className="text-xs text-muted-foreground">
              {formatDuration(output.execution_duration_ms)}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-xs">
        <div className="space-y-1">
          <div className="font-medium">{output.metadata?.node_name || output.node_id}</div>
          <div className="text-sm text-muted-foreground">
            Status: {output.success ? 'Başarılı' : 'Başarısız'}
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: {formatDuration(output.execution_duration_ms)} • Size: {formatSize(output.size_bytes)}
          </div>
          {output.error_message && (
            <div className="text-sm text-red-400">
              Error: {output.error_message}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};