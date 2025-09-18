import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination
} from '@/components/ui/pagination';
import { PageHeader } from '@/components/ui/page-header';
import { ExecutionTable } from '@/components/executions/ExecutionTable';
import { ExecutionDetailModal } from '@/components/executions/ExecutionDetailModal';
import { 
  useExecutionMonitoring
} from '@/hooks/useExecutions';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  RefreshCw, 
  Play
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';

const ITEMS_PER_PAGE = 50;

export default function ExecutionMonitoring() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  );
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Data fetching
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Use real-time monitoring when enabled, otherwise use normal fetching
  const {
    data: executionsData,
    isLoading: isExecutionsLoading,  
    error: executionsError,
    refetch: refetchExecutions
  } = useExecutionMonitoring(
    { skip, limit: ITEMS_PER_PAGE },
    isRealTimeEnabled
  );

  // URL state synchronization
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [currentPage, setSearchParams]);

  // Pagination
  const totalPages = Math.ceil((executionsData?.total || 0) / ITEMS_PER_PAGE);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal handlers
  const handleViewDetails = (executionId) => {
    console.log('handleViewDetails called with executionId:', executionId);
    console.log('Setting selectedExecutionId and opening modal');
    setSelectedExecutionId(executionId);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedExecutionId(null);
    setIsDetailModalOpen(false);
  };

  const handleNavigateToWorkflow = (workflowId) => {
    navigate(`/workflows?id=${workflowId}`);
  };

  // Manual refresh
  const handleManualRefresh = () => {
    refetchExecutions();
    toast({
      title: "Yenilendi",
      description: "Execution verileri başarıyla güncellendi",
    });
  };

  // Real-time toggle
  const handleRealTimeToggle = (enabled) => {
    setIsRealTimeEnabled(enabled);
    toast({
      title: enabled ? "Canlı İzleme Açık" : "Canlı İzleme Kapalı",
      description: enabled 
        ? "Veriler 10 saniyede bir otomatik güncellenecek" 
        : "Manuel yenileme gerekecek",
    });
  };

  // Get current data
  const currentExecutions = executionsData?.items || [];
  const currentTotal = executionsData?.total || 0;
  const isLoading = isExecutionsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-accent/5">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Page Header */}
      <PageHeader
        title="Execution Monitoring"
        description="Workflow execution'larını gerçek zamanlı olarak izleyin ve analiz edin"
        icon={Activity}
        actions={
          <div className="flex items-center gap-4">
            {/* Real-time Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="realtime"
                checked={isRealTimeEnabled}
                onCheckedChange={handleRealTimeToggle}
              />
              <Label htmlFor="realtime" className="text-sm">
                Canlı İzleme
              </Label>
              <HelpTooltip content="Açık olduğunda execution verileri 10 saniyede bir otomatik güncellenir" />
            </div>

            {/* Manual Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>

            {/* Real-time Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {isRealTimeEnabled ? 'Canlı' : 'Manuel'}
              </span>
            </div>
          </div>
        }
      />

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Execution Listesi
              {currentTotal > 0 && (
                <Badge variant="outline">
                  {currentTotal.toLocaleString('tr-TR')} sonuç
                </Badge>
              )}
            </CardTitle>
            
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play className="h-3 w-3 text-green-500" />
                <span>10s'de bir güncelleniyor</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Execution Table */}
          <ExecutionTable
            executions={currentExecutions}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onNavigateToWorkflow={handleNavigateToWorkflow}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <ExecutionDetailModal
        executionId={selectedExecutionId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onNavigateToWorkflow={handleNavigateToWorkflow}
      />
      
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs font-mono">
          Modal State: {isDetailModalOpen ? 'OPEN' : 'CLOSED'}<br/>
          Selected ID: {selectedExecutionId}<br/>
          Executions: {currentExecutions.length}
        </div>
      )}
      </div>
    </div>
  );
}