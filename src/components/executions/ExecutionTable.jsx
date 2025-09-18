import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  Activity
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  PENDING: {
    color: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
    icon: Timer,
    label: 'PENDING'
  },
  RUNNING: {
    color: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    icon: PlayCircle,
    label: 'RUNNING'
  },
  COMPLETED: {
    color: 'bg-green-500/20 text-green-700 border-green-500/30',
    icon: CheckCircle,
    label: 'COMPLETED'
  },
  FAILED: {
    color: 'bg-red-500/20 text-red-700 border-red-500/30',
    icon: XCircle,
    label: 'FAILED'
  },
  CANCELED: {
    color: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
    icon: StopCircle,
    label: 'CANCELED'
  }
};

const formatDuration = (startedAt, endedAt) => {
  if (!startedAt || !endedAt) return '-';
  
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  const durationMs = end - start;
  const seconds = Math.floor(durationMs / 1000);
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}s ${minutes}d ${secs}sn`;
  } else if (minutes > 0) {
    return `${minutes}d ${secs}sn`;
  } else {
    return `${secs}sn`;
  }
};

const getProgressValue = (execution) => {
  if (execution.status === 'COMPLETED') return 100;
  if (execution.status === 'FAILED' || execution.status === 'CANCELLED') return 0;
  
  // Calculate progress based on executed vs pending nodes
  const totalNodes = execution.pending_nodes + execution.executed_nodes;
  if (totalNodes > 0) {
    return Math.round((execution.executed_nodes / totalNodes) * 100);
  }
  
  return execution.status === 'RUNNING' ? 30 : 0;
};

export const ExecutionTable = ({ 
  executions = [], 
  isLoading = false, 
  onViewDetails,
  onNavigateToWorkflow 
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'started_at',
    direction: 'desc'
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExecutions = [...executions].sort((a, b) => {
    if (sortConfig.key === 'started_at' || sortConfig.key === 'ended_at') {
      const aDate = new Date(a[sortConfig.key] || 0);
      const bDate = new Date(b[sortConfig.key] || 0);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    if (sortConfig.key === 'duration') {
      const aDuration = a.started_at && a.ended_at ? 
        new Date(a.ended_at).getTime() - new Date(a.started_at).getTime() : 0;
      const bDuration = b.started_at && b.ended_at ? 
        new Date(b.ended_at).getTime() - new Date(b.started_at).getTime() : 0;
      return sortConfig.direction === 'asc' ? aDuration - bDuration : bDuration - aDuration;
    }
    
    const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
    
    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue, 'tr');
    } else {
      return bValue.localeCompare(aValue, 'tr');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Execution bulunamadı</h3>
        <p className="text-muted-foreground">
          Filtre kriterlerinizi değiştirmeyi deneyin veya yeni bir workflow çalıştırın.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('id')}
            >
              <div className="flex items-center gap-2">
                ID
                {sortConfig.key === 'id' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('workflow_id')}
            >
              <div className="flex items-center gap-2">
                Workflow ID
                {sortConfig.key === 'workflow_id' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Durum
                {sortConfig.key === 'status' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('started_at')}
            >
              <div className="flex items-center gap-2">
                Başlangıç
                {sortConfig.key === 'started_at' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('ended_at')}
            >
              <div className="flex items-center gap-2">
                Bitiş
                {sortConfig.key === 'ended_at' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted"
              onClick={() => handleSort('duration')}
            >
              <div className="flex items-center gap-2">
                Süre
                {sortConfig.key === 'duration' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead>Node Durumu</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExecutions.map((execution) => {
            const progressValue = getProgressValue(execution);
            
            return (
              <TableRow key={execution.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  {execution.id?.slice(-8) || 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-mono text-sm"
                    onClick={() => onNavigateToWorkflow?.(execution.workflow_id)}
                  >
                    {execution.workflow_id?.slice(-8) || 'N/A'}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </TableCell>
                <TableCell>
                  {(() => {
                    const config = STATUS_CONFIG[execution.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = config.icon;
                    return (
                      <Badge className={cn("gap-1.5", config.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-sm">
                  {execution.started_at ? (
                    <div>
                      <div>{format(new Date(execution.started_at), 'dd/MM/yyyy HH:mm', { locale: tr })}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(execution.started_at), { 
                          addSuffix: true, 
                          locale: tr 
                        })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {execution.ended_at ? (
                    <div>
                      <div>{format(new Date(execution.ended_at), 'dd/MM/yyyy HH:mm', { locale: tr })}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(execution.ended_at), { 
                          addSuffix: true, 
                          locale: tr 
                        })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {formatDuration(execution.started_at, execution.ended_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {execution.executed_nodes} / {execution.executed_nodes + execution.pending_nodes}
                    </Badge>
                    <span className="text-xs text-muted-foreground">node</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails?.(execution.id)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Detay
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};