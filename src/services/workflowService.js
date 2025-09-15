import api from './api';

export const workflowService = {
  // Get all workflows
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/workflows/?${queryParams}`);
  },

  // Get workflow by ID
  getById: async (workflowId) => {
    return api.get(`/api/bff/workflows/${workflowId}`);
  },

  // Create new workflow
  create: async (workflowData) => {
    return api.post('/api/bff/workflows/', workflowData);
  },

  // Update workflow
  update: async (workflowId, workflowData) => {
    return api.put(`/api/bff/workflows/${workflowId}`, workflowData);
  },

  // Delete workflow
  delete: async (workflowId) => {
    return api.delete(`/api/bff/workflows/${workflowId}`);
  },

  // Get workflow statistics
  getStats: async (workflowId) => {
    return api.get(`/api/bff/workflows/${workflowId}/stats`);
  },

  // Filter workflows
  filter: async (filterData) => {
    return api.post('/api/bff/workflows/filter', filterData);
  },

  // Get workflow count
  getCount: async () => {
    return api.get('/api/bff/workflows/count');
  },

  // Execute workflow
  execute: async (workflowId, executionData = {}) => {
    return api.post(`/api/bff/workflows/${workflowId}/execute`, executionData);
  },

  // Get workflow execution history
  getExecutions: async (workflowId, params = {}) => {
    const { skip = 0, limit = 50, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/workflows/${workflowId}/executions?${queryParams}`);
  }
};