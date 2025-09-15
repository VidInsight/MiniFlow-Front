import api from './api';

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

  // Get execution count (total and by status)
  getCount: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get(`/api/bff/executions/count${query}`);
  },

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