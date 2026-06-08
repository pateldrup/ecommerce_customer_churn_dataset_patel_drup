import API from './api';

export const customerService = {
  getCustomers: async (params = {}) => {
    // Basic query params mapper
    const response = await API.get('/customers', { params });
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await API.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await API.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await API.patch(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await API.delete(`/customers/${id}`);
    return response.data;
  },

  searchCustomers: async (query) => {
    const response = await API.get('/search/customers', { params: { q: query } });
    return response.data;
  },

  getSegment: async (segmentName) => {
    const response = await API.get(`/customers/segments/${segmentName}`);
    return response.data;
  },

  getChurnPredictions: async () => {
    const response = await API.get('/customers/predictions/churn');
    return response.data;
  },

  getRetentionPredictions: async () => {
    const response = await API.get('/customers/predictions/retention');
    return response.data;
  },

  getCampaignRecommendations: async () => {
    const response = await API.get('/customers/recommendations');
    return response.data;
  }
};

export default customerService;
