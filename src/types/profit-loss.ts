// Profit & Loss Types for Operator Dashboard

export interface OperatorPLStats {
  operator: {
    id: number;
    name: string;
    role: string;
    allocatedPercentage: number;
    parentOperatorId: number | null;
  };
  profitLossStats: {
    directTotalCreditRequests: number;
    directTotalDebitRequests: number;
    directNetProfitLoss: number;
    operatorReceivesFromParent: number;
    totalOperatorAmount: number;
    distributableProfit: number;
    operatorKeeps: number;
    lossShareBackToAdmin: number;
    currentWalletBalance: number;
  };
  sharingValidation: {
    totalAllocatedToChildren: number;
    canAllocateMore: boolean;
    remainingPercentage: number;
  };
  childShares: Array<{
    operatorId: number;
    operatorName: string;
    role: string;
    allocatedPercentage: number;
    shareAmount: number;
  }>;
  operatorReceivesFromParent: number;
}

export interface CompanyProfitDistribution {
  operatorUsersTotals: {
    totalPlaced: number;
    totalPayout: number;
    totalProfit: number;
    distributableProfit: number;
    excludesCompanyDirectUsers: true;
    netUserWinning: number;
  };
  adminDistribution: {
    totalDistributedToOperators: number;
    adminKeeps: number;
    adminRetentionPercentage: string;
  };
  operatorShares: Array<{
    operatorId: number;
    operatorName: string;
    role: string;
    allocatedPercentage: number;
    directProfit: number;
    receivesFromParent: number;
    totalOperatorAmount: number;
    distributesToChildren: number;
    operatorKeeps: number;
  }>;
  profitFlow: {
    description: string;
    isProfit: boolean;
    totalOperators: number;
    note: string;
  };
}

export interface PercentageValidation {
  isValid: boolean;
  errors: string[];
  maxAllowed: number;
  requested: number;
}

export type PerformanceStatus = 'profit' | 'loss' | 'no-business' | 'break-even';

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}
