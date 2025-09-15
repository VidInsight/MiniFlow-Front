import api from './api';

// Mock data for testing (remove when real APIs are ready)
const mockInputs = [
  {
    id: "input_123456789",
    execution_id: "exec_123456789",
    node_id: "node_start",
    data_type: "json",
    size_bytes: 1024,
    checksum: "abc123",
    data: { webhook_url: "https://example.com/webhook", method: "POST" },
    metadata: { source: "webhook_trigger", timestamp: new Date().toISOString() }
  },
  {
    id: "input_234567890", 
    execution_id: "exec_234567890",
    node_id: "node_http_request",
    data_type: "string",
    size_bytes: 512,
    checksum: "def456",
    data: "GET request to API endpoint",
    metadata: { source: "manual_trigger", timestamp: new Date(Date.now() - 60000).toISOString() }
  },
  {
    id: "input_345678901",
    execution_id: "exec_345678901", 
    node_id: "node_data_transform",
    data_type: "object",
    size_bytes: 2048,
    checksum: "ghi789",
    data: { users: [{ id: 1, name: "John" }, { id: 2, name: "Jane" }] },
    metadata: { source: "database_query", timestamp: new Date(Date.now() - 120000).toISOString() }
  }
];

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