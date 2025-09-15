import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '@/services/workflowService';
import { useToast } from '@/hooks/use-toast';

export const useWorkflows = (params = {}) => {
  return useQuery({
    queryKey: ['workflows', params],
    queryFn: () => workflowService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkflow = (workflowId) => {
  return useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowService.getById(workflowId),
    enabled: !!workflowId,
  });
};

export const useWorkflowStats = (workflowId) => {
  return useQuery({
    queryKey: ['workflow-stats', workflowId],
    queryFn: () => workflowService.getStats(workflowId),
    enabled: !!workflowId,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: workflowService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: "Başarılı",
        description: "Workflow başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Workflow oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ workflowId, data }) => workflowService.update(workflowId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
      toast({
        title: "Başarılı",
        description: "Workflow başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Workflow güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: workflowService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: "Başarılı",
        description: "Workflow başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Workflow silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useExecuteWorkflow = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ workflowId, data }) => workflowService.execute(workflowId, data),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Workflow başarıyla çalıştırıldı",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Workflow çalıştırılırken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};

export const useFilterWorkflows = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: workflowService.filter,
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Workflow filtrelenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
};