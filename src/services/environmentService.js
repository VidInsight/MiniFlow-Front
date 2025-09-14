import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/bff/envar`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const environmentService = {
  // Get all environment variables
  async getAll() {
    const response = await api.get('/');
    return response.data;
  },

  // Get single environment variable
  async getById(id) {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Create new environment variable
  async create(envVar) {
    const response = await api.post('/', envVar);
    return response.data;
  },

  // Update environment variable
  async update(id, envVar) {
    const response = await api.put(`/${id}`, envVar);
    return response.data;
  },

  // Delete environment variable
  async delete(id) {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  // Get count of environment variables
  async getCount() {
    const response = await api.get('/count');
    return response.data;
  },

  // Filter environment variables
  async filter(filterParams) {
    const response = await api.post('/filter', filterParams);
    return response.data;
  },
};