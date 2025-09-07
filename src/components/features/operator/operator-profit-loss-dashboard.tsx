"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOperatorProfitLossStats } from "@/react-query/operator-queries";
import { TrendingUp, TrendingDown, Minus, Wallet, Users, ArrowRight, RefreshCw } from "lucide-react";
import { cn, INR } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { OperatorPLStats, PerformanceStatus } from "@/types/profit-loss";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useGetOperatorProfitLossStats as usePL } from "@/react-query/operator-queries";

type Props = {
    operatorId: number;
    className?: string;
};

const OperatorProfitLossDashboard = ({ operatorId, className }: Props) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().subtract(30, 'day').toDate(),
        to: new Date()
    });

    const { data: plStats, isLoading, error, refetch, isRefetching } = useGetOperatorProfitLossStats({
        operatorId,
        startDate: dateRange?.from,
        endDate: dateRange?.to
    });

    const performanceStatus: PerformanceStatus = useMemo(() => {
        if (!plStats?.profitLossStats) return 'no-business';
        
        const netPL = plStats.profitLossStats.directNetProfitLoss;
        if (netPL > 0) return 'profit';
        if (netPL < 0) return 'loss';
        if (netPL === 0 && plStats.profitLossStats.directTotalPlaced > 0) return 'break-even';
        return 'no-business';
    }, [plStats]);

    const getPerformanceColor = (status: PerformanceStatus) => {
        switch (status) {
            case 'profit': return 'text-green-600 bg-green-50 border-green-200';
            case 'loss': return 'text-red-600 bg-red-50 border-red-200';
            case 'break-even': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPerformanceIcon = (status: PerformanceStatus) => {
        switch (status) {
            case 'profit': return <TrendingUp className="h-5 w-5" />;
            case 'loss': return <TrendingDown className="h-5 w-5" />;
            case 'break-even': return <Minus className="h-5 w-5" />;
            default: return <Minus className="h-5 w-5" />;
        }
    };

    if (isLoading) {
        return <LoadingScreen className="h-64" />;
    }

    if (error) {
        return (
            <div className={cn("p-6 text-center", className)}>
                <div className="text-red-500 mb-4">Error loading profit & loss data</div>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    const stats = plStats as OperatorPLStats;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header with Date Range */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Profit & Loss Dashboard</h2>
                    <p className="text-gray-600 mt-1">
                        {stats.operator.name} ({stats.operator.role.replace('_', ' ')})
                    </p>
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

            {/* Performance Overview */}
            <Card className={cn("border-2", getPerformanceColor(performanceStatus))}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {getPerformanceIcon(performanceStatus)}
                            <div>
                                <h3 className="text-lg font-semibold capitalize">
                                    {performanceStatus.replace('-', ' ')} Performance
                                </h3>
                                <p className="text-sm opacity-80">
                                    {performanceStatus === 'profit' && "Your business is generating profit"}
                                    {performanceStatus === 'loss' && "Your business is showing losses"}
                                    {performanceStatus === 'break-even' && "Your business is breaking even"}
                                    {performanceStatus === 'no-business' && "No business activity in this period"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">
                                {stats.profitLossStats.directNetProfitLoss >= 0 ? '+' : ''}
                                {INR(stats.profitLossStats.directNetProfitLoss)}
                            </div>
                            <div className="text-sm opacity-80">Net P&L</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Total Placed</span>
                        </div>
                        <div className="text-xl font-bold">
                            {INR(stats.profitLossStats.directTotalPlaced)}
                        </div>
                        <div className="text-xs text-gray-500">Direct users</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Total Payout</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            {INR(stats.profitLossStats.directTotalGrossPayout)}
                        </div>
                        <div className="text-xs text-gray-500">To users</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Wallet className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">You Keep</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            {INR(stats.profitLossStats.operatorKeeps)}
                        </div>
                        <div className="text-xs text-gray-500">After sharing</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Wallet className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium">Wallet Balance</span>
                        </div>
                        <div className="text-xl font-bold">
                            {INR(stats.profitLossStats.currentWalletBalance)}
                        </div>
                        <div className="text-xs text-gray-500">Current</div>
                    </CardContent>
                </Card>
            </div>

            {/* Money Flow Diagram */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5" />
                        Money Flow
                    </CardTitle>
                    <CardDescription>How your profit flows through the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Direct Business */}
                        {/* <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
                            <div>
                                <div className="font-medium">Direct Business</div>
                                <div className="text-sm text-gray-600">From your users</div>
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                                {INR(stats.profitLossStats.directNetProfitLoss)}
                            </div>
                        </div> */}

                        {/* From Parent */}
                        {stats.profitLossStats.operatorReceivesFromParent > 0 && (
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
                                <div>
                                    <div className="font-medium">Receives from Parent</div>
                                    <div className="text-sm text-gray-600">
                                        {stats.operator.allocatedPercentage}% allocation
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                    +{INR(stats.profitLossStats.operatorReceivesFromParent)}
                                </div>
                            </div>
                        )}

                        {/* Total Available */}
                        {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-dashed">
                            <div>
                                <div className="font-medium">Total Available</div>
                                <div className="text-sm text-gray-600">For distribution</div>
                            </div>
                            <div className="text-lg font-bold">
                                {INR(stats.profitLossStats.totalOperatorAmount)}
                            </div>
                        </div> */}

                        {/* Final Amount */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                            <div>
                                <div className="font-medium">You Keep</div>
                                <div className="text-sm text-gray-600">After child allocations</div>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                                {INR(stats.profitLossStats.operatorKeeps)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Child Allocations (recursive expandable hierarchy) */}
            {stats.childShares && stats.childShares.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Child Allocations
                        </CardTitle>
                        <CardDescription>
                            {stats.sharingValidation.totalAllocatedToChildren}% allocated to children
                            {stats.sharingValidation.canAllocateMore && (
                                <span className="text-green-600 ml-2">
                                    ({stats.sharingValidation.remainingPercentage}% remaining)
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.childShares.map((child) => (
                                <OperatorHierarchyNode key={child.operatorId} node={child} dateRange={dateRange} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Allocation Summary */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Allocation Summary</CardTitle>
                    <CardDescription>
                        Showing data for {dayjs(dateRange?.from).format('DD MMM YYYY')} - {dayjs(dateRange?.to).format('DD MMM YYYY')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.operator.allocatedPercentage}%
                            </div>
                            <div className="text-sm text-gray-600">Your Allocation</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.sharingValidation.totalAllocatedToChildren}%
                            </div>
                            <div className="text-sm text-gray-600">Given to Children</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.sharingValidation.remainingPercentage}%
                            </div>
                            <div className="text-sm text-gray-600">Available to Allocate</div>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    );
};

export default OperatorProfitLossDashboard;

// Recursive node for operator hierarchy (operator view)
const OperatorHierarchyNode = ({ node, dateRange }: { node: any; dateRange?: DateRange }) => {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = usePL({ operatorId: node.operatorId, startDate: dateRange?.from, endDate: dateRange?.to });

    return (
        <div className="border rounded-lg">
            <button className="w-full text-left p-3 flex items-center justify-between" onClick={() => setOpen((v) => !v)}>
                <div>
                    <div className="font-medium">{node.operatorName} <span className="text-xs text-gray-500 capitalize">{node.role.replace('_',' ')}</span></div>
                    <div className="text-xs text-muted-foreground">Allocated: {node.allocatedPercentage}% • Share: {INR(node.shareAmount)}</div>
                </div>
                <Badge variant="outline" className="text-xs">{open ? 'Hide' : 'Show'} children</Badge>
            </button>
            {open && (
                <div className="p-3 pt-0 space-y-2">
                    {isLoading ? (
                        <div className="py-4"><LoadingScreen className="h-16" /></div>
                    ) : (data?.childShares?.length ?? 0) > 0 ? (
                        data!.childShares!.map((c: any) => (
                            <OperatorHierarchyNode key={c.operatorId} node={c} dateRange={dateRange} />
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground">No children</div>
                    )}
                </div>
            )}
        </div>
    );
};