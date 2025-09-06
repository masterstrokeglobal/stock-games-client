"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCompanyProfitDistribution } from "@/react-query/operator-queries";
import { Building, TrendingUp, Users, PieChart, RefreshCw } from "lucide-react";
import { cn, INR } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { CompanyProfitDistribution } from "@/types/profit-loss";
import { useState } from "react";
import dayjs from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type Props = {
    className?: string;
};

const AdminProfitDistribution = ({ className }: Props) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().subtract(30, 'day').toDate(),
        to: new Date()
    });

    const { data: distribution, isLoading, error, refetch, isRefetching } = useGetCompanyProfitDistribution({
        startDate: dateRange?.from,
        endDate: dateRange?.to
    });

    if (isLoading) {
        return <LoadingScreen className="h-64" />;
    }

    if (error) {
        return (
            <div className={cn("p-6 text-center", className)}>
                <div className="text-red-500 mb-4">Error loading profit distribution</div>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    const data = distribution as CompanyProfitDistribution;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Building className="h-6 w-6" />
                        Company Profit Distribution
                    </h2>
                    <p className="text-gray-600 mt-1">Admin-only view of company-wide profit sharing</p>
                </div>
                <div className="flex items-center gap-3">
                    <DatePickerWithRange
                        initialDateRange={dateRange}
                        onDateChange={setDateRange}
                        className="w-auto"
                    />
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Status Alert */}
            <Card className={cn(
                "border-2",
                data.profitFlow.isProfit ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {data.profitFlow.isProfit ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                                <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                            )}
                            <div>
                                <h3 className="font-semibold">{data.profitFlow.description}</h3>
                                <p className="text-sm opacity-80">{data.profitFlow.note}</p>
                            </div>
                        </div>
                        <Badge variant={data.profitFlow.isProfit ? "success" : "destructive"}>
                            {data.profitFlow.totalOperators} Operators
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Company Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Total Placed</span>
                        </div>
                        <div className="text-xl font-bold">
                            {INR(data.operatorUsersTotals.totalPlaced)}
                        </div>
                        <div className="text-xs text-gray-500">Operator users only</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                            <span className="text-sm font-medium">Net User Winning</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            {INR(data.operatorUsersTotals.netUserWinning)}
                        </div>
                        <div className="text-xs text-gray-500">Net payout to operator users</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <PieChart className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Company Profit</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            {INR(data.operatorUsersTotals.totalProfit)}
                        </div>
                        <div className="text-xs text-gray-500">Available for sharing</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Admin Keeps</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                            {INR(data.adminDistribution.adminKeeps)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {data.adminDistribution.adminRetentionPercentage}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribution Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Profit Distribution Breakdown
                    </CardTitle>
                    <CardDescription>
                        How the {INR(data.operatorUsersTotals.distributableProfit)} profit is distributed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Admin Distribution */}
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                <Building className="h-6 w-6 text-purple-600" />
                                <div>
                                    <div className="font-medium">Company Admin</div>
                                    <div className="text-sm text-gray-600">Retention</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-purple-600">
                                    {INR(data.adminDistribution.adminKeeps)}
                                </div>
                                <Badge variant="outline">
                                    {data.adminDistribution.adminRetentionPercentage}
                                </Badge>
                            </div>
                        </div>

                        {/* Operator Distribution */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                <Users className="h-6 w-6 text-blue-600" />
                                <div>
                                    <div className="font-medium">Distributed to Operators</div>
                                    <div className="text-sm text-gray-600">{data.profitFlow.totalOperators} operators</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                    {INR(data.adminDistribution.totalDistributedToOperators)}
                                </div>
                                <Badge variant="outline">
                                    {(100 - parseFloat(data.adminDistribution.adminRetentionPercentage)).toFixed(2)}%
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Who Bears How Much Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Who Bears How Much
                    </CardTitle>
                    <CardDescription>Each operator's share from their parent</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(() => {
                            const roleOrder = { 
                                super_duper_master: 1, 
                                duper_master: 2, 
                                master: 3, 
                                agent: 4 
                            };

                            const fmt = (n: number) => `${n < 0 ? "-" : ""}₹${Math.abs(n).toFixed(2)}`;

                            const sortedShares = data.operatorShares
                                .sort((a, b) => roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder]);

                            const operatorLines = sortedShares.map((operator) => {
                                // Use receivesFromParent for all operators (SDM/DM/Master/Agent)
                                const bears = operator.receivesFromParent;
                                
                                return {
                                    name: operator.operatorName,
                                    amount: bears,
                                    role: operator.role
                                };
                            });

                            // Add Admin line
                            const adminLine = {
                                name: "Admin",
                                amount: data.adminDistribution.adminKeeps,
                                role: "admin"
                            };

                            const allLines = [...operatorLines, adminLine];

                            return (
                                <div className="space-y-2">
                                    {allLines.map((item, index) => {
                                        const isLoss = item.amount < 0;
                                        const isProfit = item.amount > 0;
                                        
                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 rounded border">
                                                <span className="font-medium">{item.name}</span>
                                                <span className={`font-mono text-lg font-bold ${
                                                    isLoss ? 'text-red-600' : 
                                                    isProfit ? 'text-green-600' : 
                                                    'text-gray-600'
                                                }`}>
                                                    {fmt(item.amount)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>
                        Data for {dayjs(dateRange?.from).format('DD MMM YYYY')} - {dayjs(dateRange?.to).format('DD MMM YYYY')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {data.profitFlow.totalOperators}
                            </div>
                            <div className="text-sm text-gray-600">Active Operators</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {INR(data.operatorUsersTotals.totalProfit)}
                            </div>
                            <div className="text-sm text-gray-600">Total Profit Generated</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {data.adminDistribution.adminRetentionPercentage}
                            </div>
                            <div className="text-sm text-gray-600">Admin Retention Rate</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminProfitDistribution;
