import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  User, 
  Tag, 
  Activity,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useWorkflow } from '@/hooks/useWorkflows';

// Status badge helper
const getStatusBadge = (status) => {
  const statusMap = {
    "ACTIVE": <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>,
    "INACTIVE": <Badge variant="secondary">Pasif</Badge>,
    "DRAFT": <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Taslak</Badge>,
    "PAUSED": <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Duraklatıldı</Badge>,
    "FAILED": <Badge variant="destructive">Başarısız</Badge>,
  };
  return statusMap[status] || <Badge variant="outline">{status}</Badge>;
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "Belirtilmemiş";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Priority display helper
const getPriorityDisplay = (priority) => {
  const priorityValue = priority || 50;
  let color = "text-gray-600";
  let label = "Orta";
  let bgColor = "bg-gray-100 dark:bg-gray-800";
  
  if (priorityValue >= 80) {
    color = "text-red-600 dark:text-red-400";
    label = "Çok Yüksek";
    bgColor = "bg-red-100 dark:bg-red-900";
  } else if (priorityValue >= 60) {
    color = "text-orange-600 dark:text-orange-400";
    label = "Yüksek";
    bgColor = "bg-orange-100 dark:bg-orange-900";
  } else if (priorityValue >= 40) {
    color = "text-yellow-600 dark:text-yellow-400";
    label = "Orta";
    bgColor = "bg-yellow-100 dark:bg-yellow-900";
  } else if (priorityValue >= 20) {
    color = "text-blue-600 dark:text-blue-400";
    label = "Düşük";
    bgColor = "bg-blue-100 dark:bg-blue-900";
  } else {
    color = "text-gray-600 dark:text-gray-400";
    label = "Çok Düşük";
    bgColor = "bg-gray-100 dark:bg-gray-800";
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />
      <span className={`text-sm font-medium ${color}`}>{priorityValue} - {label}</span>
    </div>
  );
};

export const WorkflowDetailsDialog = ({ open, onOpenChange, workflowId }) => {
  const { 
    data: workflow, 
    isLoading, 
    error 
  } = useWorkflow(workflowId, { enabled: open && !!workflowId });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Workflow Detayları
          </DialogTitle>
          <DialogDescription>
            Workflow'un tüm detaylarını ve özelliklerini görüntüleyin
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Yükleme Hatası</h3>
                <p className="text-muted-foreground">
                  {error.message || 'Workflow detayları yüklenirken hata oluştu'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : workflow ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Temel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Workflow ID</label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                      {workflow.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durum</label>
                    <div className="mt-1">
                      {getStatusBadge(workflow.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Workflow Adı</label>
                  <h3 className="text-xl font-semibold mt-1">{workflow.name}</h3>
                </div>

                {workflow.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Açıklama</label>
                    <p className="text-sm mt-1 leading-relaxed">{workflow.description}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Öncelik</label>
                  <div className="mt-2">
                    {getPriorityDisplay(workflow.priority)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Tarih Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Oluşturulma Tarihi</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(workflow.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Son Güncellenme</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(workflow.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Properties */}
            {Object.keys(workflow).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tüm Özellikler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(workflow).map(([key, value]) => {
                      // Skip commonly displayed fields
                      if (['id', 'name', 'description', 'status', 'priority', 'created_at', 'updated_at'].includes(key)) {
                        return null;
                      }

                      return (
                        <div key={key} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm text-right max-w-xs">
                            {value !== null && value !== undefined 
                              ? (typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2) 
                                  : String(value)
                                )
                              : 'N/A'
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Workflow bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};