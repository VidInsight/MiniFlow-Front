import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { executionInputService } from '@/services/executionInputService';
import { toast } from '@/components/ui/use-toast';

// Get all execution inputs
export const useExecutionInputs = (params = {}, options = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['executionInputs', cleanParams],
    queryFn: () => executionInputService.getAll(cleanParams),
    staleTime: 30 * 1000, // 30 seconds
    ...options
  });
};

// Get single execution input by ID
export const useExecutionInput = (inputId, options = {}) => {
  return useQuery({
    queryKey: ['executionInput', inputId],
    queryFn: () => executionInputService.getById(inputId),
    enabled: !!inputId,
    staleTime: 60 * 1000, // 1 minute
    ...options
  });
};

// Get execution input count
export const useExecutionInputCount = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  return useQuery({
    queryKey: ['executionInputCount', cleanParams],
    queryFn: () => executionInputService.getCount(cleanParams),
    staleTime: 30 * 1000
  });
};

// Filter execution inputs mutation
export const useFilterExecutionInputs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filterData) => executionInputService.filter(filterData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executionInputs'] });
    },
    onError: (error) => {
      toast({
        title: "Filtreleme Hatası",
        description: error.message || "Input'ları filtrelerken hata oluştu",
        variant: "destructive"
      });
    }
  });
};