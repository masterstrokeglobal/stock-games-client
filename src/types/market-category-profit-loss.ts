// Market Category Profit Loss Types

export interface GameStats {
  totalBets: number;
  totalWinnings: number;
  netProfitLoss: number;
  betCount: number;
  winCount: number;
  winRate: number;
}

export interface MarketCategoryStats {
  marketType: string;
  marketTypeName: string;
  stockSlots?: GameStats;
  stockJackpot?: GameStats;
  combined: GameStats;
  marketCount: number;
}

export interface MarketCategorySummary {
  totalBets: number;
  totalWinnings: number;
  netProfitLoss: number;
  totalCategories: number;
}

export interface MarketCategoryProfitLossResponse {
  success: boolean;
  data: {
    categories: MarketCategoryStats[];
    summary: MarketCategorySummary;
  };
}

export interface MarketProfitLossFilters {
  startDate?: string;
  endDate?: string;
  companyId?: number;
  marketType?: string;
}

// Individual Market (Stock) P&L Types
export interface MarketStats {
  marketId: number;
  marketName: string;
  marketCode: string;
  marketType: string;
  stockSlots?: GameStats;
  stockJackpot?: GameStats;
  combined: GameStats;
}

export interface MarketProfitLossResponse {
  success: boolean;
  data: {
    markets: MarketStats[];
    summary: {
      totalBets: number;
      totalWinnings: number;
      netProfitLoss: number;
      totalMarkets: number;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}


