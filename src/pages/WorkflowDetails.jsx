import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, TrendingUp, Users, Settings, Play } from 'lucide-react';
import { format } from 'date-fns';

import { workflowService } from '@/services/workflowService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { WorkflowDAG } from '@/components/workflow/WorkflowDAG';

const STATUS_CONFIG = {
  DRAFT: { color: 'bg-gray-500/20 text-gray-700 border-gray-500/30', label: 'DRAFT' },
  ACTIVE: { color: 'bg-green-500/20 text-green-700 border-green-500/30', label: 'ACTIVE' },
  INACTIVE: { color: 'bg-red-500/20 text-red-700 border-red-500/30', label: 'INACTIVE' },
  ARCHIVED: { color: 'bg-amber-500/20 text-amber-700 border-amber-500/30', label: 'ARCHIVED' }
};

export const WorkflowDetails = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow-details', workflowId],
    queryFn: () => workflowService.getByIdWithRelationships(workflowId),
    enabled: !!workflowId,
    select: (data) => data?.data,
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Error loading workflow</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Workflow not found</h2>
          <p className="text-muted-foreground mb-4">The requested workflow could not be found.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[workflow.status] || STATUS_CONFIG.DRAFT;

  return (
    <div className="space-y-6">
      <PageHeader
        title={workflow.name || 'Unnamed Workflow'}
        description={workflow.description || 'No description available'}
        action={
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      {/* Status and Basic Info */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge className={statusConfig.color}>
          {statusConfig.label}
        </Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Priority: {workflow.priority}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Created: {format(new Date(workflow.created_at), 'PPp')}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflow.total_executions || 0}</div>
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
            <p className="text-xs text-muted-foreground">
              {workflow.successful_executions} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflow.avg_execution_duration 
                ? `${Math.round(workflow.avg_execution_duration)}s`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nodes</CardTitle>
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

      {/* DAG Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Diagram</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visual representation of the workflow nodes and their connections
          </p>
        </CardHeader>
        <CardContent>
          <WorkflowDAG workflow={workflow} />
        </CardContent>
      </Card>

      {/* Additional Details */}
      {workflow.status_message && (
        <Card>
          <CardHeader>
            <CardTitle>Status Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{workflow.status_message}</p>
          </CardContent>
        </Card>
      )}

      {/* Triggers */}
      {workflow.triggers && workflow.triggers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflow.triggers.map((trigger) => (
                <div key={trigger.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{trigger.name}</h4>
                    <p className="text-sm text-muted-foreground">{trigger.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{trigger.trigger_type}</Badge>
                    <Badge 
                      className={trigger.status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-700 border-green-500/30'
                        : 'bg-gray-500/20 text-gray-700 border-gray-500/30'
                      }
                    >
                      {trigger.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};