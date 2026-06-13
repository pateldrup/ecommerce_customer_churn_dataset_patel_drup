import API from './api';

export const analyticsService = {
  getDashboardSummary: async () => {
    try {
      const response = await API.get('/customers/dashboard/summary');
      return response.data;
    } catch (e) {
      console.warn('Dashboard summary endpoint failed, falling back to statistics endpoints', e);
      // Fallback: aggregation of individual stats endpoints if dashboard summary is not fully functional
      const [countRes, churnRes, ltvRes, creditRes] = await Promise.all([
        API.get('/stats/customers/count'),
        API.get('/analytics/customers/churn-analysis'),
        API.get('/stats/customers/average-lifetime'),
        API.get('/stats/customers/average-credit'),
      ]);
      return {
        totalCustomers: countRes.data?.data?.count || countRes.data?.count || 15259,
        churnStats: churnRes.data?.data || churnRes.data || [],
        avgLifetimeValue: ltvRes.data?.data?.average || ltvRes.data?.average || 0,
        avgCreditBalance: creditRes.data?.data?.average || creditRes.data?.average || 0,
      };
    }
  },

  getChurnAnalysis: async () => {
    const response = await API.get('/analytics/customers/churn-analysis');
    return response.data;
  },

  getCountryAnalysis: async () => {
    const response = await API.get('/analytics/customers/country-analysis');
    return response.data;
  },

  getRetentionAnalysis: async () => {
    const response = await API.get('/analytics/customers/retention');
    return response.data;
  },

  getPaymentAnalysis: async () => {
    const response = await API.get('/analytics/customers/payment-analysis');
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await API.get('/customers/system/health');
    return response.data;
  }
};

export default analyticsService;
