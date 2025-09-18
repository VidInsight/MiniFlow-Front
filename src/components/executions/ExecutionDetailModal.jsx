import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  Activity,
  Database,
  Zap,
  FileText,
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
  PENDING: { color: 'bg-amber-500/20 text-amber-700 border-amber-500/30', icon: Timer, label: 'BEKLIYOR' },
  RUNNING: { color: 'bg-blue-500/20 text-blue-700 border-blue-500/30', icon: PlayCircle, label: 'ÇALIŞIYOR' },
  COMPLETED: { color: 'bg-green-500/20 text-green-700 border-green-500/30', icon: CheckCircle, label: 'TAMAMLANDI' },
  FAILED: { color: 'bg-red-500/20 text-red-700 border-red-500/30', icon: XCircle, label: 'BAŞARISIZ' },
  CANCELLED: { color: 'bg-gray-500/20 text-gray-700 border-gray-500/30', icon: StopCircle, label: 'İPTAL EDİLDİ' },
  TIMEOUT: { color: 'bg-orange-500/20 text-orange-700 border-orange-500/30', icon: Clock, label: 'ZAMAN AŞIMI' },
  PAUSED: { color: 'bg-purple-500/20 text-purple-700 border-purple-500/30', icon: PauseCircle, label: 'DURAKLATILDI' }
};

const LOG_LEVEL_COLORS = {
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
  debug: 'text-gray-600'
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
  if (!execution) return 0;
  if (execution.status === 'COMPLETED') return 100;
  if (execution.status === 'FAILED' || execution.status === 'CANCELLED') return 0;
  
  // Calculate progress based on executed vs pending nodes
  const totalNodes = execution.pending_nodes + execution.executed_nodes;
  if (totalNodes > 0) {
    return Math.round((execution.executed_nodes / totalNodes) * 100);
  }
  
  return execution.status === 'RUNNING' ? 45 : 0;
};

export const ExecutionDetailModal = ({ 
  executionId, 
  isOpen, 
  onClose,
  onNavigateToWorkflow 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    data: execution, 
    isLoading, 
    error 
  } = useExecution(executionId, {
    enabled: isOpen && !!executionId,
    includeRelationships: true
  });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: `${label} panoya kopyalandı`,
    });
  };

  const downloadLogs = () => {
    if (!execution?.results) return;
    
    const logsText = Object.entries(execution.results)
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
    
    const blob = new Blob([logsText], { type: 'text/plain' });
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : execution ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="logs">Node Sonuçları</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Durum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const statusConfig = STATUS_CONFIG[execution.status] || STATUS_CONFIG.PENDING;
                      const StatusIcon = statusConfig.icon;
                      return (
                        <Badge className={cn("gap-1.5 text-sm", statusConfig.color)}>
                          <StatusIcon className="h-4 w-4" />
                          {statusConfig.label}
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                      className="ml-2 p-1 h-auto"
                      onClick={() => copyToClipboard(execution.workflow_id, 'Workflow ID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Süre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {execution.started_at && execution.ended_at ? 
                        formatDuration(execution.started_at, execution.ended_at) : 
                        'Devam ediyor'
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress and Success */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">İlerleme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getProgressValue(execution)} className="h-3 mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>%{Math.round(getProgressValue(execution))}</span>
                      <span>{execution.executed_nodes} / {execution.executed_nodes + execution.pending_nodes} node</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Node Durumu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Çalıştırılmış</span>
                        <Badge variant="default">{execution.executed_nodes}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bekleyen</span>
                        <Badge variant="outline">{execution.pending_nodes}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Zaman Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Başlangıç</div>
                      {execution.started_at ? (
                        <div>
                          <div className="font-medium">
                            {format(new Date(execution.started_at), 'dd MMMM yyyy, HH:mm:ss', { locale: tr })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(execution.started_at), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Bitiş</div>
                      {execution.ended_at ? (
                        <div>
                          <div className="font-medium">
                            {format(new Date(execution.ended_at), 'dd MMMM yyyy, HH:mm:ss', { locale: tr })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(execution.ended_at), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Devam ediyor</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Node Results */}
              {execution.results && Object.keys(execution.results).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Node Sonuçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(execution.results).map(([nodeId, result]) => (
                        <div key={nodeId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-medium">{nodeId.slice(-8)}</span>
                            <Badge 
                              variant={result.status === 'SUCCESS' ? 'default' : 
                                     result.status === 'FAILED' ? 'destructive' : 'secondary'}
                            >
                              {result.status}
                            </Badge>
                          </div>
                          {result.start_time && result.start_time !== 'N/A' && (
                            <div className="text-xs text-muted-foreground mb-1">
                              Başlangıç: {format(new Date(result.start_time), 'HH:mm:ss')}
                              {result.end_time && result.end_time !== 'N/A' && (
                                <span> - Bitiş: {format(new Date(result.end_time), 'HH:mm:ss')}</span>
                              )}
                            </div>
                          )}
                          {result.result_data && Object.keys(result.result_data).length > 0 && (
                            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(result.result_data, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Node Sonuçları</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadLogs}
                  disabled={!execution.results || Object.keys(execution.results).length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sonuçları İndir
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-96">
                    {execution.results && Object.keys(execution.results).length > 0 ? (
                      <div className="p-4 space-y-3">
                        {Object.entries(execution.results)
                          .sort(([,a], [,b]) => {
                            if (a.start_time && b.start_time && a.start_time !== 'N/A' && b.start_time !== 'N/A') {
                              return new Date(a.start_time) - new Date(b.start_time);
                            }
                            return 0;
                          })
                          .map(([nodeId, result], index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm font-medium">{nodeId.slice(-12)}</span>
                                <Badge 
                                  variant={result.status === 'SUCCESS' ? 'default' : 
                                          result.status === 'FAILED' ? 'destructive' : 'secondary'}
                                >
                                  {result.status}
                                </Badge>
                              </div>
                              {result.start_time && result.start_time !== 'N/A' && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  Başlangıç: {format(new Date(result.start_time), 'dd/MM HH:mm:ss')}
                                  {result.end_time && result.end_time !== 'N/A' && (
                                    <span> - Bitiş: {format(new Date(result.end_time), 'dd/MM HH:mm:ss')}</span>
                                  )}
                                </div>
                              )}
                              {result.result_data && Object.keys(result.result_data).length > 0 && (
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                  {JSON.stringify(result.result_data, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Node sonucu bulunamadı</h3>
                        <p className="text-muted-foreground">
                          Bu execution için henüz node sonucu mevcut değil.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <h3 className="text-lg font-semibold">Performans Metrikleri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Çalışma Süreleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toplam Süre:</span>
                      <span className="font-mono">{formatDuration(execution.duration_seconds)}</span>
                    </div>
                    {execution.started_at && execution.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gerçek Süre:</span>
                        <span className="font-mono">
                          {formatDuration(
                            (new Date(execution.completed_at) - new Date(execution.started_at)) / 1000
                          )}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">İşlem İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {execution.result_summary?.processed_nodes && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">İşlenen Node:</span>
                        <span className="font-semibold">{execution.result_summary.processed_nodes}</span>
                      </div>
                    )}
                    {execution.result_summary?.total_nodes && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Toplam Node:</span>
                        <span className="font-semibold">{execution.result_summary.total_nodes}</span>
                      </div>
                    )}
                    {execution.result_summary?.success_rate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Başarı Oranı:</span>
                        <span className="font-semibold text-green-600">
                          %{Math.round(execution.result_summary.success_rate * 100)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Resource Usage (if available in metadata) */}
              {execution.metadata?.resource_usage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Kaynak Kullanımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {execution.metadata.resource_usage.cpu_usage && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            %{Math.round(execution.metadata.resource_usage.cpu_usage * 100)}
                          </div>
                          <div className="text-sm text-muted-foreground">CPU Kullanımı</div>
                        </div>
                      )}
                      {execution.metadata.resource_usage.memory_usage && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(execution.metadata.resource_usage.memory_usage / 1024 / 1024)}MB
                          </div>
                          <div className="text-sm text-muted-foreground">Bellek Kullanımı</div>
                        </div>
                      )}
                      {execution.metadata.resource_usage.network_io && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(execution.metadata.resource_usage.network_io / 1024)}KB
                          </div>
                          <div className="text-sm text-muted-foreground">Ağ I/O</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <h3 className="text-lg font-semibold">Metadata</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Trigger Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {execution.metadata?.trigger ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trigger Tipi:</span>
                        <Badge variant="outline">{execution.metadata.trigger.type}</Badge>
                      </div>
                      {execution.metadata.trigger.source && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kaynak:</span>
                          <span className="font-mono text-sm">{execution.metadata.trigger.source}</span>
                        </div>
                      )}
                      {execution.metadata.trigger.user_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kullanıcı:</span>
                          <span className="font-mono text-sm">{execution.metadata.trigger.user_id}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Trigger bilgisi mevcut değil</div>
                  )}
                </CardContent>
              </Card>

              {execution.metadata && Object.keys(execution.metadata).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tam Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
                        {JSON.stringify(execution.metadata, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Activity className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Execution bulunamadı</h3>
            <p className="text-muted-foreground">Belirtilen execution ID'si ile ilişkili veri bulunamadı.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};