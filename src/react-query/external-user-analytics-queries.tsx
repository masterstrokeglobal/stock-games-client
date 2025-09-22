import { useQuery } from "@tanstack/react-query";
import { externalUserTransactionsAPI } from "@/lib/axios/external-user-analytics-API";

// Get external user transactions
export const useGetExternalUserTransactions = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["external-user-transactions", params],
    queryFn: () => externalUserTransactionsAPI.getTransactions(params),
    enabled: true,
  });
};
