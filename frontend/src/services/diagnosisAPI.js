import api from "./api";

export const diagnosisAPI = {
  // Create new diagnosis
  createDiagnosis: async (patientData) => {
    const response = await api.post("/diagnosis/analyze-hcv/", patientData);
    return response.data;
  },

  // Get user's diagnoses
  getUserDiagnoses: async () => {
    const response = await api.get("/diagnosis/analyze-hcv/");
    return response.data;
  },

  // Get specific diagnosis
  getDiagnosis: async (id) => {
    const response = await api.get(`/diagnosis/analyze-hcv/${id}/`);
    return response.data;
  },

  // Update diagnosis metadata
  updateDiagnosis: async (id, data) => {
    const response = await api.put(`/diagnosis/analyze-hcv/${id}/`, data);
    return response.data;
  },

  // Delete diagnosis
  deleteDiagnosis: async (id) => {
    const response = await api.delete(`/diagnosis/analyze-hcv/${id}/`);
    return response.data;
  },

  // Search diagnoses
  searchDiagnoses: async (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/diagnosis/search/?${params}`);
    return response.data;
  },

  // Admin search diagnoses (all users)
  adminSearchDiagnoses: async (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/diagnosis/admin/search/?${params}`);
    return response.data;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await api.get("/diagnosis/stats/");
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await api.get("/diagnosis/analytics/user/");
    return response.data;
  },

  // Export functions
  exportCSV: async () => {
    const response = await api.get("/diagnosis/export/csv/", {
      responseType: 'blob',
    });
    return response;
  },

  exportExcel: async () => {
    const response = await api.get("/diagnosis/export/excel/", {
      responseType: 'blob',
    });
    return response;
  },
};
