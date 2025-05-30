import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diagnosisAPI } from "../services/diagnosisAPI";

export const useDiagnoses = () => {
  return useQuery({
    queryKey: ["diagnoses"],
    queryFn: diagnosisAPI.getUserDiagnoses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
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
