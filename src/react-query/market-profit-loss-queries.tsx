"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentAPI } from "@/lib/axios/payment-API";
import {
  MarketCategoryProfitLossResponse,
  MarketProfitLossResponse,
  MarketProfitLossFilters,
} from "@/types/market-category-profit-loss";

/**
 * Hook to fetch Market Category P&L (NSE, Crypto, MCX, COMEX, USA_MARKET)
 */
export const useGetMarketCategoryProfitLoss = (filters: MarketProfitLossFilters) => {
  return useQuery<MarketCategoryProfitLossResponse, Error>({
    queryKey: ["market-category-profit-loss", filters],
    queryFn: async () => {
      const response = await paymentAPI.getMarketCategoryProfitLoss(filters);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch Individual Market P&L (detailed per stock)
 */
export const useGetMarketProfitLoss = (
  filters: MarketProfitLossFilters & { page?: number; limit?: number }
) => {
  return useQuery<MarketProfitLossResponse, Error>({
    queryKey: ["market-profit-loss", filters],
    queryFn: async () => {
      const response = await paymentAPI.getMarketProfitLoss(filters);
      return response.data;
    },
    staleTime: 30000,
  });
};

/**
 * Hook to fetch Simplified Market P&L (Stock Slots only - fast)
 */
export const useGetMarketProfitLossSimplified = (filters: MarketProfitLossFilters) => {
  return useQuery<MarketProfitLossResponse, Error>({
    queryKey: ["market-profit-loss-simplified", filters],
    queryFn: async () => {
      const response = await paymentAPI.getMarketProfitLossSimplified(filters);
      return response.data;
    },
    staleTime: 30000,
  });
};



