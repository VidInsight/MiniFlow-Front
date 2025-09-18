import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Edit,
  Trash2,
  Info,
  BarChart3,
  Play,
  CheckCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';

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

// Priority display helper
const getPriorityDisplay = (priority) => {
  const priorityValue = priority || 5;
  let color = "bg-gray-500";
  let label = "Orta";
  
  if (priorityValue >= 9) {
    color = "bg-red-500";
    label = "Çok Yüksek";
  } else if (priorityValue >= 7) {
    color = "bg-orange-500";
    label = "Yüksek";
  } else if (priorityValue >= 4) {
    color = "bg-yellow-500";
    label = "Orta";
  } else if (priorityValue >= 2) {
    color = "bg-blue-500";
    label = "Düşük";
  } else {
    color = "bg-gray-500";
    label = "Çok Düşük";
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{priorityValue}</span>
    </div>
  );
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const WorkflowTable = ({ 
  workflows = [], 
  isLoading, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onViewStats,
  onExecute,
  onValidate,
  executeLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Henüz workflow yok</h3>
        <p className="text-muted-foreground mb-4">İlk workflow'unuzu oluşturmak için "Yeni Workflow" butonunu kullanın</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                Workflow Adı
                <HelpTooltip content="Workflow'un benzersiz tanımlayıcı adı" />
              </div>
            </TableHead>
            <TableHead className="font-semibold">Açıklama</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                Öncelik
                <HelpTooltip content="Workflow'un çalıştırılma önceliği (0-100)" />
              </div>
            </TableHead>
            <TableHead className="font-semibold">Durum</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                Oluşturma
                <Calendar className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                Güncelleme  
                <Calendar className="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="font-medium text-primary">
                  {workflow.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {workflow.id}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <p className="text-sm line-clamp-2">
                    {workflow.description || "Açıklama bulunmuyor"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {getPriorityDisplay(workflow.priority)}
              </TableCell>
              <TableCell>
                {getStatusBadge(workflow.status)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDate(workflow.created_at)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDate(workflow.updated_at)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(workflow)}
                    className="h-8 w-8 p-0"
                    title="Detayları Görüntüle"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewStats(workflow)}
                    className="h-8 w-8 p-0"
                    title="İstatistikleri Görüntüle"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onValidate(workflow.id)}
                    className="h-8 w-8 p-0"
                    title="Workflow'u Doğrula"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExecute(workflow.id)}
                    disabled={workflow.status === 'DRAFT' || workflow.status === 'INACTIVE' || executeLoading}
                    className="h-8 w-8 p-0"
                    title="Workflow'u Çalıştır"
                  >
                    {executeLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `/builder/${workflow.id}/`}
                    className="h-8 w-8 p-0"
                    title="Workflow Builder'a Git"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(workflow)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Workflow'u Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};