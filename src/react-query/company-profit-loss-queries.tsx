import { useQuery } from "@tanstack/react-query";
import { companyProfitLossAPI } from "@/lib/axios/company-profit-loss-API";

// Get profit/loss for all companies
export const useGetAllCompaniesProfitLoss = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["companies-profit-loss", params],
    queryFn: () => companyProfitLossAPI.getAllCompaniesProfitLoss(params),
    enabled: true,
  });
};

// Get profit/loss for a specific company
export const useGetCompanyProfitLoss = (companyId: number, params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["company-profit-loss", companyId, params],
    queryFn: () => companyProfitLossAPI.getCompanyProfitLoss(companyId, params),
    enabled: !!companyId,
  });
};

// Get profit/loss summary
export const useGetProfitLossSummary = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["profit-loss-summary", params],
    queryFn: () => companyProfitLossAPI.getProfitLossSummary(params),
    enabled: true,
  });
};

// Get profit/loss dashboard data
export const useGetProfitLossDashboard = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["profit-loss-dashboard", params],
    queryFn: () => companyProfitLossAPI.getProfitLossDashboard(params),
    enabled: true,
  });
};

// Get profit/loss for a specific user
export const useGetUserProfitLoss = (userId: number, params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["user-profit-loss", userId, params],
    queryFn: () => companyProfitLossAPI.getUserProfitLoss(userId, params),
    enabled: !!userId,
  });
};
