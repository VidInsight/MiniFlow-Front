import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scriptService } from '@/services/scriptService';
import { toast } from '@/hooks/use-toast';

// Hook to get scripts with pagination
export const useScripts = (params = {}) => {
  return useQuery({
    queryKey: ['scripts', params],
    queryFn: () => scriptService.getScripts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get scripts count
export const useScriptsCount = () => {
  return useQuery({
    queryKey: ['scripts-count'],
    queryFn: scriptService.getScriptsCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to filter scripts
export const useFilterScripts = () => {
  return useMutation({
    mutationFn: scriptService.filterScripts,
    onError: (error) => {
      toast({
        title: "Filtreleme Hatası",
        description: error.response?.data?.message || "Script filtreleme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

// Hook to get single script
export const useScript = (scriptId, excludeFields = null) => {
  return useQuery({
    queryKey: ['script', scriptId, excludeFields],
    queryFn: () => scriptService.getScriptById(scriptId, excludeFields),
    enabled: !!scriptId,
  });
};

// Hook to create script
export const useCreateScript = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scriptData) => {
      console.log('🔥 Hook: useCreateScript called with:', scriptData);
      return scriptService.createScript(scriptData);
    },
    onSuccess: (data) => {
      console.log('🎉 Hook: Script creation success:', data);
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      queryClient.invalidateQueries({ queryKey: ['scripts-count'] });
      
      toast({
        title: "Script Oluşturuldu",
        description: `Script başarıyla oluşturuldu. ID: ${data.data?.record_id}`,
      });
    },
    onError: (error) => {
      console.error('💥 Hook: Script creation error - FULL DETAILS:');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data (DETAILED):', JSON.stringify(error.response?.data, null, 2));
      console.error('Error headers:', error.response?.headers);
      
      // Try to parse detailed validation errors
      if (error.response?.status === 422 && error.response?.data) {
        console.error('🚨 422 VALIDATION ERROR BREAKDOWN:');
        const errorData = error.response.data;
        
        if (errorData.detail && Array.isArray(errorData.detail)) {
          errorData.detail.forEach((validationError, index) => {
            console.error(`Validation Error ${index + 1}:`, {
              field: validationError.loc?.join('.') || 'unknown',
              message: validationError.msg || validationError.message,
              type: validationError.type,
              input: validationError.input
            });
          });
        }
      }
      
      toast({
        title: "Oluşturma Hatası",
        description: error.response?.data?.message || "Script oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

// Hook to update script
export const useUpdateScript = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scriptId, scriptData }) => scriptService.updateScript(scriptId, scriptData),
    onSuccess: (data, { scriptId }) => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      queryClient.invalidateQueries({ queryKey: ['script', scriptId] });
      
      toast({
        title: "Script Güncellendi",
        description: "Script başarıyla güncellendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Güncelleme Hatası",
        description: error.response?.data?.message || "Script güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

// Hook to delete script
export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scriptService.deleteScript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      queryClient.invalidateQueries({ queryKey: ['scripts-count'] });
      
      toast({
        title: "Script Silindi",
        description: "Script başarıyla silindi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Silme Hatası", 
        description: error.response?.data?.message || "Script silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

// Hook to get script test stats
export const useScriptTestStats = (scriptId) => {
  return useQuery({
    queryKey: ['script-test-stats', scriptId],
    queryFn: () => scriptService.getScriptTestStats(scriptId),
    enabled: !!scriptId,
  });
};

// Hook to get script performance stats
export const useScriptPerformanceStats = (scriptId) => {
  return useQuery({
    queryKey: ['script-performance-stats', scriptId],
    queryFn: () => scriptService.getScriptPerformanceStats(scriptId),
    enabled: !!scriptId,
  });
};