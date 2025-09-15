import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '@/services/workflowService';
import { toast } from '@/hooks/use-toast';

// Get all workflows
export const useWorkflows = (params = {}, options = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['workflows', cleanParams],
    queryFn: () => workflowService.getAll(cleanParams),
    staleTime: 30 * 1000, // 30 seconds
    select: (data) => ({
      items: data.data?.items || [],
      total: data.data?.total || 0,
      skip: data.data?.skip || 0,
      limit: data.data?.limit || 50
    }),
    ...options
  });
};

// Get single workflow by ID
export const useWorkflow = (workflowId, options = {}) => {
  return useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowService.getById(workflowId),
    enabled: !!workflowId,
    staleTime: 60 * 1000, // 1 minute
    select: (data) => data.data,
    ...options
  });
};

// Get workflow count
export const useWorkflowCount = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['workflowCount', cleanParams],
    queryFn: () => workflowService.getCount(cleanParams),
    staleTime: 30 * 1000,
    select: (data) => data.data?.total || 0
  });
};

// Get workflow statistics
export const useWorkflowStats = (workflowId, options = {}) => {
  return useQuery({
    queryKey: ['workflowStats', workflowId],
    queryFn: () => workflowService.getStats(workflowId),
    enabled: !!workflowId,
    staleTime: 60 * 1000,
    select: (data) => data.data,
    ...options
  });
};

// Filter workflows mutation
export const useFilterWorkflows = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filterData) => workflowService.filter(filterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (error) => {
      toast({
        title: "Filtreleme Hatası",
        description: error.message || "Workflow'ları filtrelerken hata oluştu",
        variant: "destructive"
      });
    }
  });
};

// Create workflow mutation
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflowData) => workflowService.create(workflowData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflowCount'] });
      
      toast({
        title: "Workflow Oluşturuldu",
        description: `"${data.data?.name || 'Workflow'}" başarıyla oluşturuldu`,
      });
    },
    onError: (error) => {
      toast({
        title: "Oluşturma Hatası",
        description: error.message || "Workflow oluşturulurken hata oluştu",
        variant: "destructive"
      });
    }
  });
};

// Update workflow mutation
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId, workflowData }) => 
      workflowService.update(workflowId, workflowData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
      
      toast({
        title: "Workflow Güncellendi",
        description: "Workflow başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Güncelleme Hatası",
        description: error.message || "Workflow güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  });
};

// Delete workflow mutation
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflowId) => workflowService.delete(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflowCount'] });
      
      toast({
        title: "Workflow Silindi",
        description: "Workflow başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Silme Hatası",
        description: error.message || "Workflow silinirken hata oluştu",
        variant: "destructive"
      });
    }
  });
};

// Execute workflow mutation
export const useExecuteWorkflow = () => {
  return useMutation({
    mutationFn: ({ workflowId, executionData = {} }) => 
      workflowService.execute(workflowId, executionData),
    onSuccess: () => {
      toast({
        title: "Workflow Başlatıldı",
        description: "Workflow çalıştırma işlemi başlatıldı",
      });
    },
    onError: (error) => {
      toast({
        title: "Çalıştırma Hatası",
        description: error.message || "Workflow çalıştırılırken hata oluştu",
        variant: "destructive"
      });
    }
  });
};

// Validate workflow mutation (placeholder for future implementation)
export const useValidateWorkflow = () => {
  return useMutation({
    mutationFn: (workflowId) => {
      // Placeholder - will be implemented when validation endpoint is available
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Doğrulama Başlatıldı",
        description: "Workflow doğrulama işlemi başlatıldı",
      });
    },
    onError: (error) => {
      toast({
        title: "Doğrulama Hatası",
        description: error.message || "Workflow doğrulanırken hata oluştu",
        variant: "destructive"
      });
    }
  });
};