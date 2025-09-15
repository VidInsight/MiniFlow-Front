import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '@/services/fileService';
import { useToast } from '@/hooks/use-toast';

// Fetch all files
export const useFiles = (params = {}) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => fileService.getAll(params),
  });
};

// Fetch a single file
export const useFile = (fileId) => {
  return useQuery({
    queryKey: ['files', fileId],
    queryFn: () => fileService.getById(fileId),
    enabled: !!fileId,
  });
};

// Upload file
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, isTemporary }) => fileService.upload(file, isTemporary),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: "Dosya yüklendi",
        description: "Dosya başarıyla yüklendi ve işlendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Yükleme hatası",
        description: error.response?.data?.message || "Dosya yüklenirken hata oluştu.",
        variant: "destructive"
      });
    },
  });
};

// Delete file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: fileService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({
        title: "Dosya silindi",
        description: "Dosya sistemden başarıyla kaldırıldı.",
      });
    },
    onError: (error) => {
      toast({
        title: "Silme hatası",
        description: error.response?.data?.message || "Dosya silinirken hata oluştu.",
        variant: "destructive"
      });
    },
  });
};

// Filter files
export const useFilterFiles = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: fileService.filter,
    onError: (error) => {
      toast({
        title: "Filtreleme hatası",
        description: error.response?.data?.message || "Filtreleme işlemi başarısız oldu.",
        variant: "destructive"
      });
    },
  });
};

// Get files count
export const useFilesCount = () => {
  return useQuery({
    queryKey: ['files', 'count'],
    queryFn: fileService.getCount,
  });
};