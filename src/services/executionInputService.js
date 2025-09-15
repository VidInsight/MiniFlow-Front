import api from './api';

export const executionInputService = {
  // Get all execution inputs with pagination
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/execution-inputs/?${queryParams}`);
  },

  // Get execution input count
  getCount: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get(`/api/bff/execution-inputs/count${query}`);
  },

  // Filter execution inputs
  filter: async (filterData) => {
    return api.post('/api/bff/execution-inputs/filter', filterData);
  },

  // Get execution input by ID
  getById: async (inputId) => {
    return api.get(`/api/bff/execution-inputs/${inputId}`);
  }
};