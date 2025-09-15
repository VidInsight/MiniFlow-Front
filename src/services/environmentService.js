import api from './api';

export const environmentService = {
  // Get all environment variables
  getAll: async (params = {}) => {
    const { skip = 0, limit = 100, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/envar/?${queryParams}`);
  },

  // Get environment variable by ID
  getById: async (envarId) => {
    return api.get(`/api/bff/envar/${envarId}`);
  },

  // Create new environment variable
  create: async (envarData) => {
    return api.post('/api/bff/envar/', envarData);
  },

  // Update environment variable
  update: async (envarId, envarData) => {
    return api.put(`/api/bff/envar/${envarId}`, envarData);
  },

  // Delete environment variable
  delete: async (envarId) => {
    return api.delete(`/api/bff/envar/${envarId}`);
  },

  // Filter environment variables
  filter: async (filterData) => {
    return api.post('/api/bff/envar/filter', filterData);
  },

  // Get environment variables count
  getCount: async () => {
    return api.get('/api/bff/envar/count');
  }
};