import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionOutputService } from '@/services/executionOutputService';
import { toast } from '@/components/ui/use-toast';

// Get all execution outputs
export const useExecutionOutputs = (params = {}, options = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['executionOutputs', cleanParams],
    queryFn: () => executionOutputService.getAll(cleanParams),
    staleTime: 30 * 1000, // 30 seconds
    ...options
  });
};

// Get single execution output by ID
export const useExecutionOutput = (outputId, options = {}) => {
  return useQuery({
    queryKey: ['executionOutput', outputId],
    queryFn: () => executionOutputService.getById(outputId),
    enabled: !!outputId,
    staleTime: 60 * 1000, // 1 minute
    ...options
  });
};

// Get execution output count
export const useExecutionOutputCount = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['executionOutputCount', cleanParams],
    queryFn: () => executionOutputService.getCount(cleanParams),
    staleTime: 30 * 1000
  });
};

// Filter execution outputs mutation
export const useFilterExecutionOutputs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filterData) => executionOutputService.filter(filterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executionOutputs'] });
    },
    onError: (error) => {
      toast({
        title: "Filtreleme Hatası",
        description: error.message || "Output'ları filtrelerken hata oluştu",
        variant: "destructive"
      });
    }
  });
};