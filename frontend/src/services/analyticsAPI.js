import api from "./api";

export const analyticsAPI = {
  // User analytics
  getUserAnalytics: async () => {
    const response = await api.get("/diagnosis/analytics/user/");
    return response.data;
  },

  // Admin analytics (staff only)
  getAdminAnalytics: async () => {
    const response = await api.get("/diagnosis/analytics/admin/");
    return response.data;
  },
};
