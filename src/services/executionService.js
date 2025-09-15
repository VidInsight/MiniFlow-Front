import api from './api';

// Mock data for testing (remove when real APIs are ready)
const mockExecutions = [
  {
    id: "exec_123456789",
    workflow_id: "wf_987654321", 
    status: "RUNNING",
    started_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    completed_at: null,
    duration_seconds: 300,
    success: null,
    current_node_id: "node_abc123"
  },
  {
    id: "exec_234567890",
    workflow_id: "wf_876543210",
    status: "COMPLETED", 
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 3600,
    success: true,
    current_node_id: null
  },
  {
    id: "exec_345678901",
    workflow_id: "wf_765432109",
    status: "FAILED",
    started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), 
    completed_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 1800,
    success: false,
    current_node_id: null
  }
];

export const executionService = {
  // Get all executions with pagination
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/executions/?${queryParams}`);
  },

  // Get execution by ID with relationships
  getById: async (executionId, options = {}) => {
    const { includeRelationships = true, excludeFields = [] } = options;
    const queryParams = new URLSearchParams();
    
    if (includeRelationships) {
      queryParams.append('include_relationships', 'true');
    }
    
    if (excludeFields.length > 0) {
      queryParams.append('exclude_fields', excludeFields.join(','));
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get(`/api/bff/executions/${executionId}${query}`);
  },

  // Filter executions with complex criteria
  filter: async (filterData) => {
    return api.post('/api/bff/executions/filter', filterData);
  },

  // Get execution count (temporarily disabled due to 404)
  // getCount: async (params = {}) => {
  //   const queryParams = new URLSearchParams(params);
  //   const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  //   return api.get(`/api/bff/executions/count${query}`);
  // },

  // Get execution statistics (remove stats call that causes 404)
  // getStats: async (params = {}) => {
  //   const queryParams = new URLSearchParams(params);
  //   const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  //   return api.get(`/api/bff/executions/stats${query}`);
  // },

  // Get executions by workflow ID
  getByWorkflowId: async (workflowId, params = {}) => {
    const { skip = 0, limit = 50, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/executions/workflow/${workflowId}?${queryParams}`);
  }
};