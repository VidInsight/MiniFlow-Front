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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { skip = 0, limit = 100 } = params;
    const filteredOutputs = mockOutputs.filter(output => {
      if (params.execution_id && output.execution_id !== params.execution_id) return false;
      if (params.node_id && output.node_id !== params.node_id) return false;
      if (params.data_type && output.data_type !== params.data_type) return false;
      if (params.success !== undefined && output.success !== params.success) return false;
      return true;
    });
    
    return {
      data: {
        items: filteredOutputs.slice(skip, skip + limit),
        total: filteredOutputs.length,
        skip,
        limit
      }
    };
  },

  // Get execution output count
  getCount: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filteredOutputs = mockOutputs.filter(output => {
      if (params.execution_id && output.execution_id !== params.execution_id) return false;
      if (params.node_id && output.node_id !== params.node_id) return false;
      if (params.data_type && output.data_type !== params.data_type) return false;
      if (params.success !== undefined && output.success !== params.success) return false;
      return true;
    });
    
    return {
      data: { count: filteredOutputs.length }
    };
  },

  // Filter execution outputs
  filter: async (filterData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { execution_id, node_id, data_type, success, skip = 0, limit = 100 } = filterData;
    const filteredOutputs = mockOutputs.filter(output => {
      if (execution_id && output.execution_id !== execution_id) return false;
      if (node_id && output.node_id !== node_id) return false;
      if (data_type && output.data_type !== data_type) return false;
      if (success !== undefined && output.success !== success) return false;
      return true;
    });
    
    return {
      data: {
        items: filteredOutputs.slice(skip, skip + limit),
        total: filteredOutputs.length,
        skip,
        limit
      }
    };
  },

  // Get execution output by ID
  getById: async (outputId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const output = mockOutputs.find(o => o.id === outputId);
    
    if (!output) {
      throw {
        message: 'Output bulunamadı',
        status: 404
      };
    }
    
    return { data: output };
  }
};