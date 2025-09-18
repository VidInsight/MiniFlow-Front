import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Clock, Settings } from 'lucide-react';

const NodeConnection = ({ fromNode, toNode, condition }) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
      {/* From Node */}
      <div className="flex-1">
        <Card className="min-w-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm truncate">{fromNode.name}</h4>
              <Badge variant="outline" className="text-xs">
                {fromNode.id.slice(-8)}
              </Badge>
            </div>
            {fromNode.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {fromNode.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{fromNode.timeout_seconds}s</span>
              <Settings className="h-3 w-3 ml-2" />
              <span>{fromNode.max_retries} retries</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arrow with condition */}
      <div className="flex flex-col items-center gap-1">
        <ArrowRight className="h-5 w-5 text-primary" />
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            condition === 'SUCCESS' 
              ? 'bg-green-500/20 text-green-700 border-green-500/30' 
              : 'bg-red-500/20 text-red-700 border-red-500/30'
          }`}
        >
          {condition}
        </Badge>
      </div>

      {/* To Node */}
      <div className="flex-1">
        <Card className="min-w-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm truncate">{toNode.name}</h4>
              <Badge variant="outline" className="text-xs">
                {toNode.id.slice(-8)}
              </Badge>
            </div>
            {toNode.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {toNode.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{toNode.timeout_seconds}s</span>
              <Settings className="h-3 w-3 ml-2" />
              <span>{toNode.max_retries} retries</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const WorkflowDAG = ({ workflow }) => {
  const connections = useMemo(() => {
    if (!workflow?.nodes || !workflow?.edges) {
      return [];
    }

    // Create a map for faster node lookup
    const nodeMap = new Map(workflow.nodes.map(node => [node.id, node]));
    
    // Build connections array
    return workflow.edges.map(edge => ({
      id: edge.id,
      fromNode: nodeMap.get(edge.from_node_id),
      toNode: nodeMap.get(edge.to_node_id),
      condition: edge.condition_type,
    })).filter(conn => conn.fromNode && conn.toNode);
  }, [workflow]);

  const isolatedNodes = useMemo(() => {
    if (!workflow?.nodes || !workflow?.edges) {
      return workflow?.nodes || [];
    }

    const connectedNodeIds = new Set();
    workflow.edges.forEach(edge => {
      connectedNodeIds.add(edge.from_node_id);
      connectedNodeIds.add(edge.to_node_id);
    });

    return workflow.nodes.filter(node => !connectedNodeIds.has(node.id));
  }, [workflow]);

  if (!workflow?.nodes?.length) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflow data</h3>
          <p className="text-muted-foreground">
            This workflow doesn't have any nodes to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Node Connections */}
      {connections.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Node Connections ({connections.length})
          </h4>
          {connections.map((connection) => (
            <NodeConnection
              key={connection.id}
              fromNode={connection.fromNode}
              toNode={connection.toNode}
              condition={connection.condition}
            />
          ))}
        </div>
      )}

      {/* Isolated Nodes */}
      {isolatedNodes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Isolated Nodes ({isolatedNodes.length})
          </h4>
          <div className="grid gap-2">
            {isolatedNodes.map((node) => (
              <Card key={node.id} className="bg-muted/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{node.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {node.id.slice(-8)}
                    </Badge>
                  </div>
                  {node.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {node.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{node.timeout_seconds}s</span>
                    <Settings className="h-3 w-3 ml-2" />
                    <span>{node.max_retries} retries</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Connections Message */}
      {connections.length === 0 && isolatedNodes.length === workflow.nodes.length && (
        <div className="text-center py-8">
          <ArrowRight className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No connections found between nodes
          </p>
        </div>
      )}
    </div>
  );
};
