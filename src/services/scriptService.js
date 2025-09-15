import api from './api';

export const scriptService = {
  // Get all scripts with pagination
  getScripts: async (params = {}) => {
    const { skip = 0, limit = 20, exclude_fields } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(exclude_fields && { exclude_fields })
    });
    
    return api.get(`/api/bff/scripts/?${queryParams}`);
  },

  // Get script count
  getScriptsCount: async () => {
    return api.get('/api/bff/scripts/count');
  },

  // Filter scripts
  filterScripts: async (filterData) => {
    return api.post('/api/bff/scripts/filter', filterData);
  },

  // Get script by ID
  getScriptById: async (scriptId, excludeFields = null) => {
    const queryParams = excludeFields 
      ? `?exclude_fields=${excludeFields}`
      : '';
    return api.get(`/api/bff/scripts/${scriptId}${queryParams}`);
  },

  // Create new script
  createScript: async (scriptData) => {
    return api.post('/api/bff/scripts/', scriptData);
  },

  // Update script
  updateScript: async (scriptId, scriptData) => {
    return api.put(`/api/bff/scripts/${scriptId}`, scriptData);
  },

  // Delete script
  deleteScript: async (scriptId) => {
    return api.delete(`/api/bff/scripts/${scriptId}`);
  },

  // Get script test statistics
  getScriptTestStats: async (scriptId) => {
    return api.get(`/api/bff/scripts/${scriptId}/test-stats`);
  },

  // Get script performance statistics
  getScriptPerformanceStats: async (scriptId) => {
    return api.get(`/api/bff/scripts/${scriptId}/performance-stats`);
  }
};