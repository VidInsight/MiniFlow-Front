import api from './api';

export const executionOutputService = {
  // Get all execution outputs with pagination
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/execution-outputs/?${queryParams}`);
  },

  // Get execution output count
  getCount: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get(`/api/bff/execution-outputs/count${query}`);
  },

  // Filter execution outputs
  filter: async (filterData) => {
    return api.post('/api/bff/execution-outputs/filter', filterData);
  },

  // Get execution output by ID
  getById: async (outputId) => {
    return api.get(`/api/bff/execution-outputs/${outputId}`);
  }
};