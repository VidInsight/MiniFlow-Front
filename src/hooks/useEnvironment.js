import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentService } from '@/services/environmentService';
import { useToast } from '@/hooks/use-toast';

export const useEnvironmentVariables = (params = {}) => {
  return useQuery({
    queryKey: ['environment-variables', params],
    queryFn: () => environmentService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEnvironmentVariable = (envarId) => {
  return useQuery({
    queryKey: ['environment-variable', envarId],
    queryFn: () => environmentService.getById(envarId),
    enabled: !!envarId,
  });
};

export const useCreateEnvironmentVariable = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: environmentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['environment-variables'] });
      toast({
        title: "Başarılı",
        description: "Ortam değişkeni başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ortam değişkeni oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEnvironmentVariable = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ envarId, data }) => environmentService.update(envarId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['environment-variables'] });
      queryClient.invalidateQueries({ queryKey: ['environment-variable', variables.envarId] });
      toast({
        title: "Başarılı",
        description: "Ortam değişkeni başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ortam değişkeni güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEnvironmentVariable = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: environmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment-variables'] });
      toast({
        title: "Başarılı",
        description: "Ortam değişkeni başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ortam değişkeni silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useFilterEnvironmentVariables = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: environmentService.filter,
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Ortam değişkenleri filtrelenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};