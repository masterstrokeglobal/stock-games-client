"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/common/loading-screen";
import MarketCategoryCard from "@/components/features/market-profit-loss/market-category-card";
import MarketCategoryDetail from "@/components/features/market-profit-loss/market-category-detail";
import CompanySelect from "@/components/features/transaction/company-select";
import {
  useGetMarketCategoryProfitLoss,
  useGetMarketProfitLoss,
} from "@/react-query/market-profit-loss-queries";
import { MarketCategoryStats } from "@/types/market-category-profit-loss";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

export default function MarketCategoryProfitLossPage() {
  const { userDetails } = useAuthStore();
  const user = userDetails as Admin;

  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(30, "days").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailPage, setDetailPage] = useState(1);
  const [companyId, setCompanyId] = useState<string>("all");

  // Fetch category overview
  const { data: categoryData, isLoading: categoryLoading } =
    useGetMarketCategoryProfitLoss({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      companyId: companyId === "all" ? undefined : parseInt(companyId),
    });

  // Fetch detailed market data when a category is selected
  const { data: marketData, isLoading: marketLoading } = useGetMarketProfitLoss(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      marketType: selectedCategory?.toUpperCase() || undefined,
      companyId: companyId === "all" ? undefined : parseInt(companyId),
      page: detailPage,
      limit: 10,
    }
  );

  const handleCategoryClick = (category: MarketCategoryStats) => {
    setSelectedCategory(category.marketType);
    setDetailPage(1);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setDetailPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (categoryLoading && !selectedCategory) {
    return <LoadingScreen className="h-[60vh]">Loading market categories...</LoadingScreen>;
  }

  const summary = categoryData?.data?.summary;
  const categories = categoryData?.data?.categories || [];

  return (
    <div className="container-main min-h-[60vh] my-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Market Category Profit & Loss
              </h1>
              <p className="text-muted-foreground">
                View P&L grouped by market categories (NSE, Crypto, MCX, COMEX, USA Market)
              </p>
            </div>

            {/* Date Range Filters */}
            <div className="flex gap-2 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Super Admin Company Filter */}
          {user?.isSuperAdmin && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter by Company:</span>
                <CompanySelect setCompanyId={setCompanyId} companyId={companyId} />
              </div>
              {companyId === "all" ? (
                <span className="text-xs text-muted-foreground">
                  Showing data from all companies
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Showing data for selected company only
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {summary && !selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold">
                    {formatCurrency(summary.totalBets)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Winnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold">
                    {formatCurrency(summary.totalWinnings)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Profit/Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {summary.netProfitLoss >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      summary.netProfitLoss >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {formatCurrency(summary.netProfitLoss)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {summary.totalCategories}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Market types with activity
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Level 1: Category Overview */}
        {!selectedCategory && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Market Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <MarketCategoryCard
                  key={category.marketType}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>

            {categories.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No market category data available for the selected date range.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Level 2: Detailed Market Breakdown */}
        {selectedCategory && (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleBackToCategories}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold">
                {categories.find((c) => c.marketType === selectedCategory)
                  ?.marketTypeName || selectedCategory.toUpperCase()}{" "}
                Markets
              </h2>
            </div>

            <MarketCategoryDetail
              markets={marketData?.data?.markets || []}
              totalPages={marketData?.data?.pagination?.totalPages || 1}
              currentPage={detailPage}
              isLoading={marketLoading}
              onPageChange={setDetailPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

