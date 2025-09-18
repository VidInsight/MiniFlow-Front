import api from './api';


export const executionService = {
  // Get all executions with pagination
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100 } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    
    return api.get(`/api/bff/executions/?${queryParams}`);
  },

  // Get execution by ID
  getById: async (executionId) => {
    return api.get(`/api/bff/executions/${executionId}`);
  },

  // Get executions by workflow ID
  getByWorkflowId: async (workflowId, params = {}) => {
    const { skip = 0, limit = 50 } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    
    return api.get(`/api/bff/executions/workflow/${workflowId}?${queryParams}`);
  }
};