import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diagnosisAPI } from "../services/diagnosisAPI";

export const useDiagnoses = () => {
  return useQuery({
    queryKey: ["diagnoses"],
    queryFn: diagnosisAPI.getUserDiagnoses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    onError: (error) => {
      console.error("Failed to fetch diagnoses");
      console.error("Error fetching diagnoses:", error);
    },
  });
};

export const useDiagnosis = (id) => {
  return useQuery({
    queryKey: ["diagnosis", id],
    queryFn: () => diagnosisAPI.getDiagnosis(id),
    enabled: !!id,
  });
};

export const useCreateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: diagnosisAPI.createDiagnosis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["quick-stats"] });
      console.log("Diagnosis created successfully");
    },
    onError: (error) => {
      console.error("Failed to create diagnosis");
      console.error("Error creating diagnosis:", error);
    },
  });
};

export const useUpdateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => diagnosisAPI.updateDiagnosis(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
      queryClient.invalidateQueries({ queryKey: ["diagnosis", variables.id] });
      console.log("Diagnosis updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update diagnosis");
      console.error("Error updating diagnosis:", error);
    },
  });
};

export const useDeleteDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: diagnosisAPI.deleteDiagnosis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
      queryClient.invalidateQueries({ queryKey: ["user-analytics"] });
      console.log("Diagnosis deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete diagnosis");
      console.error("Error deleting diagnosis:", error);
    },
  });
};

export const useSearchDiagnoses = (filters) => {
  return useQuery({
    queryKey: ["search-diagnoses", filters],
    queryFn: () => diagnosisAPI.searchDiagnoses(filters),
    enabled: Object.keys(filters || {}).length > 0,
    keepPreviousData: true,
  });
};

export const useAdminSearchDiagnoses = (filters) => {
  return useQuery({
    queryKey: ["admin-search-diagnoses", filters],
    queryFn: () => diagnosisAPI.adminSearchDiagnoses(filters),
    enabled: Object.keys(filters || {}).length > 0,
    keepPreviousData: true,
  });
};

export const useQuickStats = () => {
  return useQuery({
    queryKey: ["quick-stats"],
    queryFn: diagnosisAPI.getQuickStats,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ["user-analytics"],
    queryFn: diagnosisAPI.getUserAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Export hooks for CSV and Excel downloads
export const useExportCSV = () => {
  return useMutation({
    mutationFn: diagnosisAPI.exportCSV,
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diagnoses.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("CSV export completed successfully");
    },
    onError: (error) => {
      console.error("Failed to export CSV");
      console.error("Error exporting CSV:", error);
    },
  });
};

export const useExportExcel = () => {
  return useMutation({
    mutationFn: diagnosisAPI.exportExcel,
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diagnoses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Excel export completed successfully");
    },
    onError: (error) => {
      console.error("Failed to export Excel");
      console.error("Error exporting Excel:", error);
    },
  });
};
