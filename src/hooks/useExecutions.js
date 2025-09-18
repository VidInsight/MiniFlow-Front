import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionService } from '../services/executionService';
import { useToast } from '@/hooks/use-toast';

// Hook for fetching all executions with pagination
export const useExecutions = (params = {}, options = {}) => {
  const { enabled = true, refetchInterval } = options;
  
  // Clean up params to remove null/empty values
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  return useQuery({
    queryKey: ['executions', cleanParams],
    queryFn: () => executionService.getAll(cleanParams),
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
  const { enabled = true } = options;
  
  return useQuery({
    queryKey: ['execution', executionId],
    queryFn: () => executionService.getById(executionId),
    enabled: enabled && !!executionId,
    staleTime: 60000, // 1 minute
    retry: 2,
    retryDelay: 1000,
    select: (data) => {
      console.log('useExecution: Raw API response', data);
      console.log('useExecution: Data structure', Object.keys(data || {}));
      // API interceptor already returns response.data, so we access data.data directly
      return data?.data;
    },
    onError: (error) => {
      console.error('useExecution: Query failed', error);
    }
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