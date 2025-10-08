"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketCategorySummary } from "@/types/market-category-profit-loss";
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketCategorySummaryProps {
  summary: MarketCategorySummary;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function MarketCategorySummaryWidget({ summary }: MarketCategorySummaryProps) {
  const isProfit = summary.netProfitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Total Bets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalBets)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all market categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Total Winnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalWinnings)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Paid out to users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            Net Profit/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              isProfit ? "text-green-600" : "text-red-600"
            )}
          >
            {formatCurrency(summary.netProfitLoss)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isProfit ? "Company profit" : "Company loss"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            Active Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{summary.totalCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Market types with activity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}



