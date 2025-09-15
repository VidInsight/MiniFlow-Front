import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Timer, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useExecutionStats, useExecutionCount } from '@/hooks/useExecutions';

const STATUS_ICONS = {
  PENDING: Timer,
  RUNNING: PlayCircle,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: XCircle,
  TIMEOUT: Clock,
  PAUSED: Timer
};

const STATUS_COLORS = {
  PENDING: 'text-amber-600',
  RUNNING: 'text-blue-600',
  COMPLETED: 'text-green-600',
  FAILED: 'text-red-600',
  CANCELLED: 'text-gray-600',
  TIMEOUT: 'text-orange-600',
  PAUSED: 'text-purple-600'
};

export const ExecutionStats = ({ filters = {}, className = "" }) => {
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useExecutionStats(filters);
  
  const { 
    data: counts, 
    isLoading: countsLoading, 
    error: countsError 
  } = useExecutionCount(filters);

  const isLoading = statsLoading || countsLoading;
  const hasError = statsError || countsError;

  // Calculate summary metrics
  const totalExecutions = counts?.total || 0;
  const successfulExecutions = counts?.by_success?.true || 0;
  const failedExecutions = counts?.by_success?.false || 0;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
  
  // Status distribution
  const statusCounts = counts?.by_status || {};
  const runningCount = statusCounts.RUNNING || 0;
  const pendingCount = statusCounts.PENDING || 0;
  const completedCount = statusCounts.COMPLETED || 0;
  const failedCount = statusCounts.FAILED || 0;

  if (hasError) {
    return (
      <Card className={className}>
          <div className="text-center py-12">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-12 w-12 mx-auto bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 mx-auto bg-muted rounded animate-pulse" />
                <div className="h-3 w-48 mx-auto bg-muted rounded animate-pulse" />
              </div>
            ) : (
              <>
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">İstatistikler yüklenemedi</h3>
                <div className="text-muted-foreground text-sm">
                  {statsError?.message || countsError?.message || 'Bilinmeyen bir hata oluştu'}
                </div>
              </>
            )}
          </div>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Executions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Execution</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{totalExecutions.toLocaleString('tr-TR')}</div>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-xs text-muted-foreground">
                {runningCount + pendingCount > 0 ? `${runningCount + pendingCount} aktif` : 'Tümü tamamlandı'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                %{Math.round(successRate)}
              </div>
            )}
          </div>
          <div className="mt-2">
            {isLoading ? (
              <div className="h-2 w-full bg-muted rounded animate-pulse" />
            ) : (
              <Progress value={successRate} className="h-2" />
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="h-3 w-24 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <div className="text-xs text-muted-foreground mt-1">
                {successfulExecutions} başarılı, {failedExecutions} başarısız
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Running Executions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Çalışan</CardTitle>
          <PlayCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">{runningCount}</div>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-xs text-muted-foreground">
                {pendingCount} bekliyor
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Failed Executions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Başarısız</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-xs text-muted-foreground">
                {totalExecutions > 0 
                  ? `%${Math.round((failedCount / totalExecutions) * 100)} hata`
                  : 'Hata yok'
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Durum Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                if (count === 0) return null;
                
                const StatusIcon = STATUS_ICONS[status] || Activity;
                const colorClass = STATUS_COLORS[status] || 'text-gray-600';
                
                return (
                  <div key={status} className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${colorClass}`} />
                    <Badge variant="outline" className="gap-1">
                      <span className="font-medium">{status}</span>
                      <span className="text-muted-foreground">({count})</span>
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      {stats && !isLoading && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Performans Özeti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.average_duration && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(stats.average_duration)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Ortalama Süre</div>
                </div>
              )}
              {stats.fastest_execution && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(stats.fastest_execution)}s
                  </div>
                  <div className="text-sm text-muted-foreground">En Hızlı</div>
                </div>
              )}
              {stats.slowest_execution && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(stats.slowest_execution)}s
                  </div>
                  <div className="text-sm text-muted-foreground">En Yavaş</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};