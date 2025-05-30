import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../services/analyticsAPI";

export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ["user-analytics"],
    queryFn: analyticsAPI.getUserAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: analyticsAPI.getAdminAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// General analytics hook (defaults to user analytics)
export const useAnalytics = () => {
  return useUserAnalytics();
};
