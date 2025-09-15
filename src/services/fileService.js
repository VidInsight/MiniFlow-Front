import api from './api';

export const fileService = {
  // Get all files with pagination
  getAll: async (params = {}) => {
    const { skip = 0, limit = 20, ...otherParams } = params;
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...otherParams
    });
    
    return api.get(`/api/bff/files/?${queryParams}`);
  },

  // Get file by ID
  getById: async (fileId) => {
    return api.get(`/api/bff/files/${fileId}`);
  },

  // Upload file
  upload: async (file, isTemporary = false) => {
    const formData = new FormData();
    formData.append('file', file);
    if (isTemporary) {
      formData.append('is_temporary', 'true');
    }
    
    return api.post('/api/bff/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete file
  delete: async (fileId) => {
    return api.delete(`/api/bff/files/${fileId}`);
  },

  // Filter files
  filter: async (filterData) => {
    return api.post('/api/bff/files/filter', filterData);
  },

  // Get files count
  getCount: async () => {
    return api.get('/api/bff/files/count');
  }
};