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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { skip = 0, limit = 100 } = params;
    const filteredInputs = mockInputs.filter(input => {
      if (params.execution_id && input.execution_id !== params.execution_id) return false;
      if (params.node_id && input.node_id !== params.node_id) return false;
      if (params.data_type && input.data_type !== params.data_type) return false;
      return true;
    });
    
    return {
      data: {
        items: filteredInputs.slice(skip, skip + limit),
        total: filteredInputs.length,
        skip,
        limit
      }
    };
  },

  // Get execution input count
  getCount: async (params = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filteredInputs = mockInputs.filter(input => {
      if (params.execution_id && input.execution_id !== params.execution_id) return false;
      if (params.node_id && input.node_id !== params.node_id) return false;
      if (params.data_type && input.data_type !== params.data_type) return false;
      return true;
    });
    
    return {
      data: { count: filteredInputs.length }
    };
  },

  // Filter execution inputs
  filter: async (filterData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { execution_id, node_id, data_type, skip = 0, limit = 100 } = filterData;
    const filteredInputs = mockInputs.filter(input => {
      if (execution_id && input.execution_id !== execution_id) return false;
      if (node_id && input.node_id !== node_id) return false;
      if (data_type && input.data_type !== data_type) return false;
      return true;
    });
    
    return {
      data: {
        items: filteredInputs.slice(skip, skip + limit),
        total: filteredInputs.length,
        skip,
        limit
      }
    };
  },

  // Get execution input by ID
  getById: async (inputId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const input = mockInputs.find(i => i.id === inputId);
    
    if (!input) {
      throw {
        message: 'Input bulunamadı',
        status: 404
      };
    }
    
    return { data: input };
  }
};