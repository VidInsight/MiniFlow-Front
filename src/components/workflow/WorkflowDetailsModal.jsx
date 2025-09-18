import { useQuery } from '@tanstack/react-query';
import { X, Settings, Play, Clock, TrendingUp, Database, ArrowRight } from 'lucide-react';

import { workflowService } from '@/services/workflowService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { WorkflowDAG } from '@/components/workflow/WorkflowDAG';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  DRAFT: { color: 'bg-gray-500/20 text-gray-700 border-gray-500/30', label: 'DRAFT' },
  ACTIVE: { color: 'bg-green-500/20 text-green-700 border-green-500/30', label: 'ACTIVE' },
  INACTIVE: { color: 'bg-red-500/20 text-red-700 border-red-500/30', label: 'INACTIVE' },
  ARCHIVED: { color: 'bg-amber-500/20 text-amber-700 border-amber-500/30', label: 'ARCHIVED' }
};

export const WorkflowDetailsModal = ({ workflowId, isOpen, onClose }) => {
  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow-details-modal', workflowId],
    queryFn: () => workflowService.getByIdWithRelationships(workflowId),
    enabled: isOpen && !!workflowId,
    select: (data) => data?.data,
  });

  if (!isOpen) return null;

  const statusConfig = workflow ? STATUS_CONFIG[workflow.status] || STATUS_CONFIG.DRAFT : STATUS_CONFIG.DRAFT;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5" />
              {isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <span>{workflow?.name || 'Workflow Details'}</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Error loading workflow</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        ) : !workflow ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Workflow not found</h3>
              <p className="text-muted-foreground mb-4">The requested workflow could not be found.</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Priority: {workflow.priority}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Created: {format(new Date(workflow.created_at), 'PPp')}
                </div>
              </div>
              
              {workflow.description && (
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workflow.total_executions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {workflow.successful_executions || 0} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {workflow.total_executions > 0 
                      ? Math.round((workflow.successful_executions / workflow.total_executions) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Structure</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workflow.nodes?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {workflow.edges?.length || 0} connections
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Triggers */}
            {workflow.triggers && workflow.triggers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Triggers ({workflow.triggers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workflow.triggers.map((trigger) => (
                      <div key={trigger.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{trigger.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {trigger.trigger_type}
                            </Badge>
                          </div>
                          {trigger.description && (
                            <p className="text-xs text-muted-foreground">{trigger.description}</p>
                          )}
                        </div>
                        <Badge 
                          className={trigger.status === 'ACTIVE' 
                            ? 'bg-green-500/20 text-green-700 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-700 border-gray-500/30'
                          }
                        >
                          {trigger.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Node Flow Summary */}
            {workflow.nodes && workflow.nodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Node Flow ({workflow.nodes.length} nodes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workflow.nodes.map((node) => (
                      <div key={node.id} className="flex items-center justify-between p-2 border rounded bg-muted/10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{node.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {node.id.slice(-8)}
                            </Badge>
                          </div>
                          {node.description && (
                            <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Node ID: {node.id} | Script ID: {node.script_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {node.timeout_seconds}s
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DAG Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Diagram</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual representation of the workflow structure
                </p>
              </CardHeader>
              <CardContent>
                <WorkflowDAG workflow={workflow} />
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};