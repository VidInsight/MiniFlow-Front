import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionService } from '../services/executionService';
import { useToast } from '@/hooks/use-toast';

// Hook for fetching all executions with pagination
export const useExecutions = (params = {}, options = {}) => {
  const { enabled = true, refetchInterval } = options;
  
  return useQuery({
    queryKey: ['executions', params],
    queryFn: () => executionService.getAll(params),
    enabled,
    refetchInterval,
    staleTime: 30000, // 30 seconds
    select: (data) => ({
      items: data.data?.items || [],
      total: data.data?.total || 0,
      skip: data.data?.skip || 0,
      limit: data.data?.limit || 100
    })
  });
};

// Hook for fetching single execution details
export const useExecution = (executionId, options = {}) => {
  const { enabled = true, includeRelationships = true, excludeFields = [] } = options;
  
  return useQuery({
    queryKey: ['execution', executionId, { includeRelationships, excludeFields }],
    queryFn: () => executionService.getById(executionId, { includeRelationships, excludeFields }),
    enabled: enabled && !!executionId,
    staleTime: 60000, // 1 minute
    select: (data) => data.data
  });
};

// Hook for execution count and statistics
export const useExecutionCount = (params = {}) => {
  return useQuery({
    queryKey: ['execution-count', params],
    queryFn: () => executionService.getCount(params),
    staleTime: 30000,
    select: (data) => data.data
  });
};

// Hook for execution statistics
export const useExecutionStats = (params = {}) => {
  return useQuery({
    queryKey: ['execution-stats', params],
    queryFn: () => executionService.getStats(params),
    staleTime: 30000,
    select: (data) => data.data
  });
};

// Hook for filtering executions
export const useFilterExecutions = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (filterData) => executionService.filter(filterData),
    onError: (error) => {
      toast({
        title: "Filtreleme Hatası",
        description: error.message || "Execution'lar filtrelenemedi",
        variant: "destructive",
      });
    },
    select: (data) => ({
      items: data.data?.items || [],
      total: data.data?.total || 0,
      skip: data.data?.skip || 0,
      limit: data.data?.limit || 100
    })
  });
};

// Hook for executions by workflow ID
export const useExecutionsByWorkflow = (workflowId, params = {}) => {
  return useQuery({
    queryKey: ['executions', 'workflow', workflowId, params],
    queryFn: () => executionService.getByWorkflowId(workflowId, params),
    enabled: !!workflowId,
    staleTime: 30000,
    select: (data) => ({
      items: data.data?.items || [],
      total: data.data?.total || 0,
      skip: data.data?.skip || 0,
      limit: data.data?.limit || 50
    })
  });
};

// Hook for real-time execution monitoring
export const useExecutionMonitoring = (params = {}, enabled = true) => {
  return useExecutions(params, {
    enabled,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};