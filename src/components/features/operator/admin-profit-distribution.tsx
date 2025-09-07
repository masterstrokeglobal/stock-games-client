"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCompanyProfitDistribution, useGetOperatorProfitLossStats } from "@/react-query/operator-queries";
import { Building, TrendingUp, Users, PieChart, RefreshCw } from "lucide-react";
import { cn, INR } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { CompanyProfitDistribution } from "@/types/profit-loss";
import { useState } from "react";
import dayjs from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
// removed navigation to report as per requirement

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
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Who Bears How Much
                    </CardTitle>
                    <CardDescription>Actual profit after distributing to children</CardDescription>
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
                                // Calculate actual profit: totalOperatorAmount - distributesToChildren
                                const bears = operator.totalOperatorAmount - operator.distributesToChildren;
                                
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
            </Card> */}

            {/* Super Duper Masters Breakdown (expandable hierarchy view) */}
            <SDMMasterBreakdown dateRange={dateRange} data={data} />

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

// Internal component to render Super Duper Masters with expandable hierarchy profit view
const SDMMasterBreakdown = ({ dateRange, data }: { dateRange?: DateRange; data: CompanyProfitDistribution }) => {
    const sdmList = (data?.operatorShares ?? []).filter((op) => op.role === 'super_duper_master');

    if (!sdmList.length) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Super Duper Masters
                </CardTitle>
                <CardDescription>Expand a master to view its hierarchy profit distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {sdmList.map((sdm) => (
                    <SDMItem
                        key={sdm.operatorId}
                        operatorId={sdm.operatorId}
                        operatorName={sdm.operatorName}
                        totals={{
                            totalOperatorAmount: sdm.totalOperatorAmount,
                            operatorKeeps: sdm.operatorKeeps,
                            distributesToChildren: sdm.distributesToChildren,
                        }}
                        dateRange={dateRange}
                    />
                ))}
            </CardContent>
        </Card>
    );
};

const SDMItem = ({ operatorId, operatorName, totals, dateRange }: { operatorId: number; operatorName: string; totals: { totalOperatorAmount: number; operatorKeeps: number; distributesToChildren: number; }; dateRange?: DateRange; }) => {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetOperatorProfitLossStats({
        operatorId,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
    });

    return (
        <div className={cn("border rounded-lg", open ? "bg-gray-50" : "")}>
            <button onClick={() => setOpen((v) => !v)} className="w-full text-left p-3 flex items-center justify-between">
                <div>
                    <div className="font-medium">{operatorName}</div>
                    <div className="text-xs text-muted-foreground">Total: {INR(totals.totalOperatorAmount)} • Keeps: {INR(totals.operatorKeeps)} • Distributes: {INR(totals.distributesToChildren)}</div>
                </div>
                <span className="text-xs text-primary">{open ? 'Hide' : 'View'} hierarchy</span>
            </button>
            {open && (
                <div className="p-3 pt-0">
                    {isLoading ? (
                        <div className="py-6"><LoadingScreen className="h-24" /></div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Hierarchy distribution</div>
                            <div className="space-y-2">
                                {(data?.childShares ?? []).map((c: any) => (
                                    <HierarchyNode key={c.operatorId} node={c} dateRange={dateRange} />
                                ))}
                                {(!data?.childShares || data.childShares.length === 0) && (
                                    <div className="text-sm text-muted-foreground">No children</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Recursive lazy node for full hierarchy expansion
const HierarchyNode = ({ node, dateRange, depth = 0 }: { node: any; dateRange?: DateRange; depth?: number }) => {
    const [open, setOpen] = useState(false);

    // Lazy-load child details when expanded
    const { data, isLoading } = useGetOperatorProfitLossStats(
        { operatorId: node.operatorId, startDate: dateRange?.from, endDate: dateRange?.to },
    );

    const hasChildren = (data?.childShares?.length ?? 0) > 0;

    return (
        <div className="border rounded-md bg-white">
            <button
                className="w-full text-left p-3 flex items-center justify-between"
                onClick={() => setOpen((v) => !v)}
            >
                <div>
                    <div className="font-medium">
                        {node.operatorName}
                        <span className="ml-2 text-xs text-muted-foreground capitalize">{node.role?.replaceAll('_', ' ')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Allocated: {node.allocatedPercentage}% • Share: {INR(node.shareAmount)}
                    </div>
                </div>
                <Badge variant="outline" className="text-xs">{open ? 'Hide' : 'Show'} children</Badge>
            </button>
            {open && (
                <div className="p-3 pt-0 space-y-2">
                    {isLoading ? (
                        <div className="py-4"><LoadingScreen className="h-16" /></div>
                    ) : hasChildren ? (
                        (data?.childShares ?? []).map((child: any) => (
                            <HierarchyNode key={child.operatorId} node={child} dateRange={dateRange} depth={depth + 1} />
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">No children</div>
                    )}
                </div>
            )}
        </div>
    );
};
