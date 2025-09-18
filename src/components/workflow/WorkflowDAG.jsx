import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Settings, Database } from 'lucide-react';

const CustomNode = ({ data }) => {
  return (
    <Card className="min-w-[280px] shadow-lg border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {data.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Node
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{data.timeout_seconds}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            <span>{data.max_retries} retries</span>
          </div>
        </div>

        {data.input_params && Object.keys(data.input_params).length > 0 && (
          <div className="pt-1">
            <div className="text-xs font-medium text-muted-foreground mb-1">Inputs:</div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(data.input_params).slice(0, 3).map((param) => (
                <Badge key={param} variant="outline" className="text-xs">
                  {param}
                </Badge>
              ))}
              {Object.keys(data.input_params).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{Object.keys(data.input_params).length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {data.output_params && Object.keys(data.output_params).length > 0 && (
          <div className="pt-1">
            <div className="text-xs font-medium text-muted-foreground mb-1">Outputs:</div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(data.output_params).slice(0, 3).map((param) => (
                <Badge key={param} variant="outline" className="text-xs">
                  {param}
                </Badge>
              ))}
              {Object.keys(data.output_params).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{Object.keys(data.output_params).length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const WorkflowDAG = ({ workflow }) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!workflow?.nodes || !workflow?.edges) {
      return { nodes: [], edges: [] };
    }

    // Create a map for faster lookup
    const nodeMap = new Map(workflow.nodes.map(node => [node.id, node]));
    
    // Calculate positions using a simple layout algorithm
    const positions = calculateNodePositions(workflow.nodes, workflow.edges);

    const nodes = workflow.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: positions[node.id] || { x: 0, y: 0 },
      data: {
        ...node,
        label: node.name,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    const edges = workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.from_node_id,
      target: edge.to_node_id,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      label: edge.condition_type,
      labelStyle: { 
        fontSize: 10, 
        fontWeight: 500,
        fill: 'hsl(var(--muted-foreground))'
      },
      labelBgStyle: { 
        fill: 'hsl(var(--background))', 
        fillOpacity: 0.8 
      },
      style: {
        stroke: edge.condition_type === 'SUCCESS' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
        strokeWidth: 2,
      },
    }));

    return { nodes, edges };
  }, [workflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(() => {
    // Prevent connections in view mode
  }, []);

  if (!workflow?.nodes?.length) {
    return (
      <div className="flex items-center justify-center h-96 border rounded-lg">
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
    <div className="h-96 border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

// Simple layout algorithm for node positioning
function calculateNodePositions(nodes, edges) {
  const positions = {};
  const visited = new Set();
  const levels = new Map();
  
  // Build adjacency list
  const graph = new Map();
  const inDegree = new Map();
  
  nodes.forEach(node => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  
  edges.forEach(edge => {
    graph.get(edge.from_node_id)?.push(edge.to_node_id);
    inDegree.set(edge.to_node_id, (inDegree.get(edge.to_node_id) || 0) + 1);
  });
  
  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => inDegree.get(node.id) === 0);
  
  // If no root nodes found, pick the first node
  if (rootNodes.length === 0 && nodes.length > 0) {
    rootNodes.push(nodes[0]);
  }
  
  // BFS to assign levels
  const queue = [];
  rootNodes.forEach(node => {
    levels.set(node.id, 0);
    queue.push(node.id);
  });
  
  while (queue.length > 0) {
    const nodeId = queue.shift();
    const currentLevel = levels.get(nodeId) || 0;
    
    const children = graph.get(nodeId) || [];
    children.forEach(childId => {
      const newLevel = currentLevel + 1;
      if (!levels.has(childId) || levels.get(childId) < newLevel) {
        levels.set(childId, newLevel);
        queue.push(childId);
      }
    });
  }
  
  // Group nodes by level
  const nodesByLevel = new Map();
  levels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level).push(nodeId);
  });
  
  // Assign positions
  const LEVEL_WIDTH = 350;
  const NODE_HEIGHT = 150;
  
  nodesByLevel.forEach((nodesAtLevel, level) => {
    nodesAtLevel.forEach((nodeId, index) => {
      positions[nodeId] = {
        x: level * LEVEL_WIDTH,
        y: index * NODE_HEIGHT + (index * 50), // Add some spacing
      };
    });
  });
  
  return positions;
}