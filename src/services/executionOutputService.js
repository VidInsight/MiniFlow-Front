import api from './api';

// Mock data for testing (remove when real APIs are ready)
const mockOutputs = [
  {
    id: "output_123456789",
    execution_id: "exec_123456789",
    node_id: "node_http_response",
    data_type: "json",
    size_bytes: 2048,
    success: true,
    error_message: null,
    checksum: "xyz123",
    execution_duration_ms: 1500,
    data: { status: 200, response: { message: "Success", data: [1, 2, 3] } },
    metadata: { node_name: "HTTP Response", completed_at: new Date().toISOString() }
  },
  {
    id: "output_234567890",
    execution_id: "exec_234567890", 
    node_id: "node_email_send",
    data_type: "boolean",
    size_bytes: 64,
    success: true,
    error_message: null,
    checksum: "uvw456",
    execution_duration_ms: 3200,
    data: true,
    metadata: { node_name: "Send Email", completed_at: new Date(Date.now() - 60000).toISOString() }
  },
  {
    id: "output_345678901",
    execution_id: "exec_345678901",
    node_id: "node_database_save", 
    data_type: "object",
    size_bytes: 1024,
    success: false,
    error_message: "Database connection timeout",
    checksum: "rst789",
    execution_duration_ms: 8000,
    data: null,
    metadata: { node_name: "Save to DB", completed_at: new Date(Date.now() - 120000).toISOString() }
  }
];

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