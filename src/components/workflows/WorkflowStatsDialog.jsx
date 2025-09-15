import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWorkflowStats } from "@/hooks/useWorkflows";
import { 
  Loader2, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  TrendingUp
} from "lucide-react";

const formatDuration = (milliseconds) => {
  if (!milliseconds) return "N/A";
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}s ${minutes % 60}dk`;
  if (minutes > 0) return `${minutes}dk ${seconds % 60}sn`;
  return `${seconds}sn`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function WorkflowStatsDialog({ open, onOpenChange, workflowId, workflowName }) {
  const { data: stats, isLoading, error } = useWorkflowStats(workflowId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Workflow İstatistikleri
          </DialogTitle>
          <DialogDescription>
            {workflowName} için detaylı performans istatistikleri
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">İstatistikler yükleniyor...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">
              İstatistikler yüklenirken bir hata oluştu: {error.message}
            </p>
          </div>
        )}
        
        {stats?.data && (
          <div className="space-y-6">
            {/* Genel İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-primary" />
                    Toplam Çalıştırma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.data.total_executions || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Başarılı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {stats.data.successful_executions || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.data.total_executions > 0 
                      ? `%${Math.round((stats.data.successful_executions / stats.data.total_executions) * 100)}`
                      : "0%"
                    } başarı oranı
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    Başarısız
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {stats.data.failed_executions || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.data.total_executions > 0 
                      ? `%${Math.round((stats.data.failed_executions / stats.data.total_executions) * 100)}`
                      : "0%"
                    } hata oranı
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    Ortalama Süre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDuration(stats.data.average_duration)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detaylı İstatistikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performans Metrikleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">En Hızlı Çalıştırma:</span>
                    <span className="font-medium">{formatDuration(stats.data.fastest_execution)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">En Yavaş Çalıştırma:</span>
                    <span className="font-medium">{formatDuration(stats.data.slowest_execution)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Medyan Süre:</span>
                    <span className="font-medium">{formatDuration(stats.data.median_duration)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Son 24 Saat:</span>
                    <span className="font-medium">{stats.data.executions_last_24h || 0} çalıştırma</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktivite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Son Çalıştırma:</span>
                    <span className="font-medium">{formatDate(stats.data.last_execution)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Son Başarılı:</span>
                    <span className="font-medium">{formatDate(stats.data.last_successful_execution)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Son Başarısız:</span>
                    <span className="font-medium">{formatDate(stats.data.last_failed_execution)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Oluşturulma:</span>
                    <span className="font-medium">{formatDate(stats.data.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Trend Bilgisi */}
            {stats.data.trend && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trend Analizi
                  </CardTitle>
                  <CardDescription>Son 7 günlük performans trendi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={stats.data.trend.direction === 'up' ? 'success' : 
                              stats.data.trend.direction === 'down' ? 'destructive' : 'secondary'}
                    >
                      {stats.data.trend.direction === 'up' ? '↗️ Artış' : 
                       stats.data.trend.direction === 'down' ? '↘️ Azalış' : '➡️ Sabit'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      %{Math.abs(stats.data.trend.percentage || 0)} değişim
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}