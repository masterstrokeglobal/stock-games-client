"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketCategoryStats } from "@/types/market-category-profit-loss";
import { TrendingUp, TrendingDown, Activity, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketCategoryCardProps {
  category: MarketCategoryStats;
  onClick: () => void;
}

const marketIcons: Record<string, any> = {
  nse: "🇮🇳",
  crypto: "₿",
  mcx: "🥇",
  comex: "💰",
  usa_market: "🇺🇸",
};

const marketColors: Record<string, string> = {
  nse: "from-blue-500 to-blue-600",
  crypto: "from-orange-500 to-orange-600",
  mcx: "from-yellow-500 to-yellow-600",
  comex: "from-green-500 to-green-600",
  usa_market: "from-purple-500 to-purple-600",
};

export default function MarketCategoryCard({ category, onClick }: MarketCategoryCardProps) {
  const isProfit = category.combined.netProfitLoss >= 0;
  const icon = marketIcons[category.marketType] || "📊";
  const gradientColor = marketColors[category.marketType] || "from-gray-500 to-gray-600";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary"
      onClick={onClick}
    >
      <CardHeader className={cn("bg-gradient-to-r text-white", gradientColor)}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <div className="text-xl font-bold">{category.marketTypeName}</div>
              <div className="text-xs opacity-90 font-normal">
                {category.combined.marketCount || 0} Markets
              </div>
            </div>
          </div>
          {isProfit ? (
            <TrendingUp className="w-6 h-6" />
          ) : (
            <TrendingDown className="w-6 h-6" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Net P&L */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Net P&L</span>
            </div>
            <span
              className={cn(
                "text-xl font-bold",
                isProfit ? "text-green-600" : "text-red-600"
              )}
            >
              {formatCurrency(category.combined.netProfitLoss)}
            </span>
          </div>

          {/* Total Bets */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="text-sm">Total Bets</span>
            </div>
            <span className="font-semibold">
              {formatCurrency(category.combined.totalBets)}
            </span>
          </div>

          {/* Total Winnings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Total Winnings</span>
            </div>
            <span className="font-semibold">
              {formatCurrency(category.combined.totalWinnings)}
            </span>
          </div>

          {/* Bet Count & Win Rate */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {category.combined.betCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {category.combined.winRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



