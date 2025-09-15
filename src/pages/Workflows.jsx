import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PageHeader } from '@/components/ui/page-header';
import { WorkflowTable } from '@/components/workflows/WorkflowTable';
import { WorkflowFilters } from '@/components/workflows/WorkflowFilters';
import { CreateWorkflowDialog } from '@/components/workflows/CreateWorkflowDialog';
import { EditWorkflowDialog } from '@/components/workflows/EditWorkflowDialog';
import { DeleteWorkflowDialog } from '@/components/workflows/DeleteWorkflowDialog';
import { WorkflowStatsDialog } from '@/components/workflows/WorkflowStatsDialog';
import { WorkflowDetailsDialog } from '@/components/workflows/WorkflowDetailsDialog';
import { 
  useWorkflows, 
  useWorkflowCount, 
  useFilterWorkflows,
  useExecuteWorkflow,
  useValidateWorkflow 
} from '@/hooks/useWorkflows';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Workflow,
  Filter,
  TrendingUp
} from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function Workflows() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  );
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    status: searchParams.get('status') || '',
    minPriority: searchParams.get('minPriority') || '',
    maxPriority: searchParams.get('maxPriority') || ''
  });
  const [isFiltering, setIsFiltering] = useState(false);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [deletingWorkflow, setDeletingWorkflow] = useState(null);
  const [statsWorkflow, setStatsWorkflow] = useState(null);
  const [detailsWorkflow, setDetailsWorkflow] = useState(null);

  // Data fetching
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const {
    data: workflowsData,
    isLoading: isWorkflowsLoading,
    error: workflowsError,
    refetch: refetchWorkflows
  } = useWorkflows({ ...filters, skip, limit: ITEMS_PER_PAGE });

  const { data: totalWorkflows } = useWorkflowCount();

  // Filter mutation for advanced filtering
  const filterMutation = useFilterWorkflows();
  const executeWorkflow = useExecuteWorkflow();
  const validateWorkflow = useValidateWorkflow();

  // URL state synchronization
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (filters.name) params.set('name', filters.name);
    if (filters.status) params.set('status', filters.status);
    if (filters.minPriority) params.set('minPriority', filters.minPriority);
    if (filters.maxPriority) params.set('maxPriority', filters.maxPriority);
    
    setSearchParams(params);
  }, [currentPage, filters, setSearchParams]);

  // Filter handling
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFiltering(true);
    
    // Use filter mutation for complex filters
    const hasAdvancedFilters = 
      newFilters.name || 
      newFilters.status || 
      newFilters.minPriority ||
      newFilters.maxPriority;
    
    if (hasAdvancedFilters) {
      const filterPayload = {
        ...newFilters,
        skip: 0,
        limit: ITEMS_PER_PAGE
      };
      
      filterMutation.mutate(filterPayload, {
        onSettled: () => setIsFiltering(false)
      });
    } else {
      setIsFiltering(false);
    }
  }, [filterMutation]);

  // Pagination
  const totalPages = Math.ceil((workflowsData?.total || 0) / ITEMS_PER_PAGE);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action handlers
  const handleEdit = (workflow) => {
    // For now, show a placeholder message
    toast({
      title: "Düzenleme Sayfası",
      description: "Workflow düzenleme sayfası yakında eklenecek",
    });
    // Future implementation: navigate to `/workflows/edit/${workflow.id}`
  };

  const handleDelete = (workflow) => {
    setDeletingWorkflow(workflow);
  };

  const handleViewDetails = (workflow) => {
    setDetailsWorkflow(workflow);
  };

  const handleViewStats = (workflow) => {
    setStatsWorkflow(workflow);
  };

  const handleExecute = async (workflowId) => {
    try {
      await executeWorkflow.mutateAsync({ workflowId });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleValidate = async (workflowId) => {
    try {
      await validateWorkflow.mutateAsync(workflowId);
    } catch (error) {
      // Error handled by hook
    }
  };

  // Get current data
  const currentWorkflows = filterMutation.data?.data?.items || workflowsData?.items || [];
  const currentTotal = filterMutation.data?.data?.total || workflowsData?.total || 0;
  const isLoading = isWorkflowsLoading || filterMutation.isPending || isFiltering;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Workflow Yönetimi"
        description="Otomasyon workflow'larınızı oluşturun, yönetin ve izleyin"
        icon={Workflow}
        actions={
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover:shadow-strong transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Workflow
          </Button>
        }
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Workflow</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkflows || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtrelenmiş Sonuç</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTotal}</div>
            {currentTotal !== totalWorkflows && (
              <p className="text-xs text-muted-foreground">
                Toplam {totalWorkflows} workflow'dan filtrelendi
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Başarı</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              İstatistik yakında eklenecek
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <WorkflowFilters
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        isLoading={isLoading}
      />

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflow Listesi
              {currentTotal > 0 && (
                <Badge variant="outline">
                  {currentTotal.toLocaleString('tr-TR')} sonuç
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {workflowsError && (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">
                Workflow'lar yüklenirken hata oluştu: {workflowsError.message}
              </p>
              <Button onClick={refetchWorkflows} variant="outline">
                Tekrar Dene
              </Button>
            </div>
          )}

          {/* Workflow Table */}
          {!workflowsError && (
            <WorkflowTable
              workflows={currentWorkflows}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onViewStats={handleViewStats}
              onExecute={handleExecute}
              onValidate={handleValidate}
              executeLoading={executeWorkflow.isPending}
            />
          )}

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

      {/* Dialogs */}
      <CreateWorkflowDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
      
      <EditWorkflowDialog 
        open={!!editingWorkflow} 
        onOpenChange={(open) => !open && setEditingWorkflow(null)}
        workflowId={editingWorkflow}
      />
      
      <DeleteWorkflowDialog 
        open={!!deletingWorkflow} 
        onOpenChange={(open) => !open && setDeletingWorkflow(null)}
        workflow={deletingWorkflow}
      />
      
      <WorkflowStatsDialog 
        open={!!statsWorkflow} 
        onOpenChange={(open) => !open && setStatsWorkflow(null)}
        workflow={statsWorkflow}
      />

      <WorkflowDetailsDialog 
        open={!!detailsWorkflow} 
        onOpenChange={(open) => !open && setDetailsWorkflow(null)}
        workflowId={detailsWorkflow?.id}
      />
    </div>
  );
}