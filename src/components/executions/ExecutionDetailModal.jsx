import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  StopCircle,
  Timer,
  Activity,
  Database,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useExecution } from '@/hooks/useExecutions';
import { useToast } from '@/hooks/use-toast';

const STATUS_CONFIG = {
  PENDING: { color: 'bg-amber-500/20 text-amber-700 border-amber-500/30', icon: Timer, label: 'PENDING' },
  RUNNING: { color: 'bg-blue-500/20 text-blue-700 border-blue-500/30', icon: PlayCircle, label: 'RUNNING' },
  COMPLETED: { color: 'bg-green-500/20 text-green-700 border-green-500/30', icon: CheckCircle, label: 'COMPLETED' },
  FAILED: { color: 'bg-red-500/20 text-red-700 border-red-500/30', icon: XCircle, label: 'FAILED' },
  CANCELED: { color: 'bg-gray-500/20 text-gray-700 border-gray-500/30', icon: StopCircle, label: 'CANCELED' }
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

export const ExecutionDetailModal = ({ 
  executionId, 
  isOpen, 
  onClose,
  onNavigateToWorkflow 
}) => {
  const { toast } = useToast();
  
  const { 
    data: execution, 
    isLoading, 
    error 
  } = useExecution(executionId, {
    enabled: isOpen && !!executionId
  });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: `${label} panoya kopyalandı`,
    });
  };

  const downloadResults = () => {
    if (!execution?.results) return;
    
    const resultsText = Object.entries(execution.results)
      .map(([nodeId, result]) => {
        const lines = [`Node: ${nodeId}`, `Status: ${result.status}`];
        if (result.start_time && result.start_time !== 'N/A') {
          lines.push(`Start: ${result.start_time}`);
        }
        if (result.end_time && result.end_time !== 'N/A') {
          lines.push(`End: ${result.end_time}`);
        }
        if (result.result_data) {
          lines.push(`Data: ${JSON.stringify(result.result_data, null, 2)}`);
        }
        return lines.join('\n');
      })
      .join('\n\n');
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-${executionId}-results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Hata</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Execution detayları yüklenemedi</h3>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={onClose}>Kapat</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Execution Detayları
            {execution && (
              <Badge variant="outline" className="font-mono text-xs">
                {execution.id?.slice(-12)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-6 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        ) : execution ? (
          <ScrollArea className="h-[70vh]">
            <div className="space-y-6 pb-6">
              {/* Genel Bilgiler */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Genel Bilgiler
                </h3>
                
                {/* Status, Workflow, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">DURUM</div>
                      {(() => {
                        const statusConfig = STATUS_CONFIG[execution.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = statusConfig.icon;
                        return (
                          <Badge className={cn("gap-1.5", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">WORKFLOW</div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-mono text-sm"
                          onClick={() => onNavigateToWorkflow?.(execution.workflow_id)}
                        >
                          {execution.workflow_id?.slice(-12)}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => copyToClipboard(execution.workflow_id, 'Workflow ID')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">SÜRE</div>
                      <div className="text-sm font-semibold">
                        {execution.started_at && execution.ended_at ? 
                          formatDuration(execution.started_at, execution.ended_at) : 
                          'Devam ediyor'
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">NODE DURUMU</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          {execution.executed_nodes}
                        </Badge>
                        <span className="text-xs text-muted-foreground">/</span>
                        <Badge variant="outline" className="text-xs">
                          {execution.executed_nodes + execution.pending_nodes}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">BAŞLANGIÇ</div>
                      {execution.started_at ? (
                        <div>
                          <div className="text-sm font-medium">
                            {format(new Date(execution.started_at), 'dd MMMM yyyy, HH:mm:ss', { locale: tr })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(execution.started_at), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">BİTİŞ</div>
                      {execution.ended_at ? (
                        <div>
                          <div className="text-sm font-medium">
                            {format(new Date(execution.ended_at), 'dd MMMM yyyy, HH:mm:ss', { locale: tr })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(execution.ended_at), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Devam ediyor</span>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Node Sonuçları */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Node Sonuçları
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadResults}
                    disabled={!execution.results || Object.keys(execution.results).length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    İndir
                  </Button>
                </div>

                {execution.results && Object.keys(execution.results).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(execution.results)
                      .sort(([,a], [,b]) => {
                        if (a.start_time && b.start_time && a.start_time !== 'N/A' && b.start_time !== 'N/A') {
                          return new Date(a.start_time) - new Date(b.start_time);
                        }
                        return 0;
                      })
                      .map(([nodeId, result], index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-mono text-sm font-semibold mb-1">{nodeId}</div>
                                <div className="text-xs text-muted-foreground">
                                  Node ID: {nodeId.slice(-12)}
                                </div>
                              </div>
                              <Badge 
                                variant={result.status === 'SUCCESS' ? 'default' : 
                                        result.status === 'FAILED' ? 'destructive' : 'secondary'}
                                className="ml-2"
                              >
                                {result.status}
                              </Badge>
                            </div>
                            
                            {(result.start_time && result.start_time !== 'N/A') && (
                              <div className="text-xs text-muted-foreground mb-3 flex items-center gap-4">
                                <span>
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  Başlangıç: {format(new Date(result.start_time), 'dd/MM HH:mm:ss')}
                                </span>
                                {result.end_time && result.end_time !== 'N/A' && (
                                  <span>
                                    Bitiş: {format(new Date(result.end_time), 'dd/MM HH:mm:ss')}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {result.result_data && Object.keys(result.result_data).length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-muted-foreground mb-2">ÇIKTI VERİLERİ</div>
                                <div className="bg-muted/50 rounded-md p-3 border">
                                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                    {JSON.stringify(result.result_data, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h4 className="text-sm font-semibold mb-2">Node sonucu bulunamadı</h4>
                        <p className="text-xs text-muted-foreground">
                          Bu execution için henüz node sonucu mevcut değil.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Error Details (if any) */}
              {execution.error_details && Object.keys(execution.error_details).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      Hata Detayları
                    </h3>
                    <Card className="border-red-200">
                      <CardContent className="p-4">
                        <pre className="text-xs overflow-x-auto bg-red-50 p-3 rounded border">
                          {JSON.stringify(execution.error_details, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};