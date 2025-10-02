"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSettlements } from "@/react-query/operator-queries";
import { Building, TrendingUp, Users, PieChart, RefreshCw } from "lucide-react";
import { cn, INR } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { CompanyProfitDistribution } from "@/types/profit-loss";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
    className?: string;
};

const AdminProfitDistribution = ({ className }: Props) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().subtract(30, 'day').toDate(),
        to: new Date()
    });

    // State for managing dropdown expansions
    const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['super_duper_master'])); // Start with top level expanded
    
    // Function to toggle expansion of hierarchy levels
    const toggleExpansion = (level: string) => {
        setExpandedLevels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(level)) {
                newSet.delete(level);
            } else {
                newSet.add(level);
            }
            return newSet;
        });
    };

    // Memoize filter parameters to prevent infinite re-renders
    const filterParams = useMemo(() => ({
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        aggregate: true
    }), [dateRange?.from, dateRange?.to]);

    const { data: settlementsData, isLoading, error, refetch, isRefetching } = useGetSettlements(filterParams);

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

    // Map settlements API response to CompanyProfitDistribution format
    const data: CompanyProfitDistribution = settlementsData ? {
        operatorUsersTotals: {
            totalPlaced: settlementsData.summary?.totalPlacement || 0,
            totalPayout: settlementsData.summary?.totalWinning || 0,
            totalProfit: settlementsData.summary?.net || 0,
            distributableProfit: settlementsData.summary?.net || 0,
            excludesCompanyDirectUsers: true,
            netUserWinning: Math.max((settlementsData.summary?.totalWinning || 0) - (settlementsData.summary?.totalPlacement || 0), 0),
        },
        adminDistribution: {
            totalDistributedToOperators: (settlementsData.summary?.distribution?.agent || 0) + 
                                       (settlementsData.summary?.distribution?.master || 0) + 
                                       (settlementsData.summary?.distribution?.duper_master || 0) + 
                                       (settlementsData.summary?.distribution?.super_duper_master || 0),
            adminKeeps: settlementsData.summary?.distribution?.company || 0,
            adminRetentionPercentage: settlementsData.summary?.net && settlementsData.summary?.net > 0 
                ? ((settlementsData.summary?.distribution?.company || 0) / Math.abs(settlementsData.summary?.net) * 100).toFixed(2)
                : "0.00",
        },
        operatorShares: settlementsData.settlements?.flatMap((settlement: any) => {
            const distributions = settlement.distribution || {};
            const hierarchy = [
                {
                    operatorId: settlement.agentId || 0,
                    operatorName: settlement.chainId || `Agent #${settlement.agentId}`,
                    role: "super_duper_master",
                    allocatedPercentage: 0,
                    directProfit: settlement.net || 0,
                    receivesFromParent: 0,
                    totalOperatorAmount: settlement.net || 0,
                    distributesToChildren: (distributions.duper_master || 0) + (distributions.master || 0) + (distributions.agent || 0),
                    operatorKeeps: distributions.super_duper_master || 0,
                },
                {
                    operatorId: settlement.agentId || 0,
                    operatorName: settlement.chainId || `Agent #${settlement.agentId}`,
                    role: "duper_master",
                    allocatedPercentage: 0,
                    directProfit: 0,
                    receivesFromParent: distributions.super_duper_master || 0,
                    totalOperatorAmount: distributions.duper_master || 0,
                    distributesToChildren: (distributions.master || 0) + (distributions.agent || 0),
                    operatorKeeps: distributions.duper_master || 0,
                },
                {
                    operatorId: settlement.agentId || 0,
                    operatorName: settlement.chainId || `Agent #${settlement.agentId}`,
                    role: "master",
                    allocatedPercentage: 0,
                    directProfit: 0,
                    receivesFromParent: distributions.duper_master || 0,
                    totalOperatorAmount: distributions.master || 0,
                    distributesToChildren: distributions.agent || 0,
                    operatorKeeps: distributions.master || 0,
                },
                {
                    operatorId: settlement.agentId || 0,
                    operatorName: settlement.chainId || `Agent #${settlement.agentId}`,
                    role: "agent",
                    allocatedPercentage: 0,
                    directProfit: 0,
                    receivesFromParent: distributions.master || 0,
                    totalOperatorAmount: distributions.agent || 0,
                    distributesToChildren: 0,
                    operatorKeeps: distributions.agent || 0,
                }
            ];
            return hierarchy; // Show all levels including those with 0 values
        }) || [],
        profitFlow: {
            description: "Profit Distribution Overview",
            isProfit: (settlementsData.summary?.net || 0) > 0,
            totalOperators: settlementsData.settlements?.length || 0,
            note: "Operator hierarchy profit distribution",
        }
    } : {
        operatorUsersTotals: {
            totalPlaced: 0,
            totalPayout: 0,
            totalProfit: 0,
            distributableProfit: 0,
            excludesCompanyDirectUsers: true,
            netUserWinning: 0,
        },
        adminDistribution: {
            totalDistributedToOperators: 0,
            adminKeeps: 0,
            adminRetentionPercentage: "0.00",
        },
        operatorShares: [],
        profitFlow: {
            description: "No data available",
            isProfit: false,
            totalOperators: 0,
            note: "No settlement data found",
        }
    };

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
                            <TrendingUp className={`h-4 w-4 ${
                                data.operatorUsersTotals.netUserWinning > 0 ? 'text-green-600' : 'text-red-600 rotate-180'
                            }`} />
                            <span className="text-sm font-medium">Net User Winning</span>
                        </div>
                        <div className={`text-xl font-bold ${
                            data.operatorUsersTotals.netUserWinning > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {INR(data.operatorUsersTotals.netUserWinning)}
                        </div>
                        <div className="text-xs text-gray-500">Net payout to operator users</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <PieChart className={`h-4 w-4 ${data.operatorUsersTotals.totalProfit < 0 ? 'text-red-600' : 'text-green-600'}`} />
                            <span className="text-sm font-medium">Company Profit</span>
                        </div>
                        <div className={`text-xl font-bold ${
                            data.operatorUsersTotals.totalProfit < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {INR(data.operatorUsersTotals.totalProfit)}
                        </div>
                        <div className="text-xs text-gray-500">Available for sharing</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Building className={`h-4 w-4 ${data.adminDistribution.adminKeeps < 0 ? 'text-red-600' : 'text-purple-600'}`} />
                            <span className="text-sm font-medium">Admin Keeps</span>
                        </div>
                        <div className={`text-xl font-bold ${
                            data.adminDistribution.adminKeeps < 0 ? 'text-red-600' : 'text-purple-600'
                        }`}>
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
                        Operator Hierarchy Distribution
                    </CardTitle>
                    <CardDescription>Profit distribution from top-level (Super Duper Master) to bottom-level (Agent)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {(() => {

                            const roleLabels = {
                                super_duper_master: "Super Duper Master",
                                duper_master: "Duper Master", 
                                master: "Master",
                                agent: "Agent"
                            };

                            const fmt = (n: number) => `${n < 0 ? "-" : ""}₹${Math.abs(n).toFixed(2)}`;

                            // Group operators by role for hierarchical display
                            const groupedByRole = data.operatorShares.reduce((acc, operator) => {
                                if (!acc[operator.role]) {
                                    acc[operator.role] = [];
                                }
                                acc[operator.role].push(operator);
                                return acc;
                            }, {} as Record<string, typeof data.operatorShares>);

                            // Helper function to get next level in hierarchy
                            const getNextLevel = (currentRole: string): string | null => {
                                switch (currentRole) {
                                    case 'super_duper_master': return 'duper_master';
                                    case 'duper_master': return 'master';
                                    case 'master': return 'agent';
                                    default: return null;
                                }
                            };

                            // Get color based on role
                            const getRoleColor = (role: string) => {
                                switch (role) {
                                    case 'super_duper_master': return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
                                    case 'duper_master': return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
                                    case 'master': return 'border-green-200 bg-green-50 hover:bg-green-100';
                                    case 'agent': return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
                                    default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
                                }
                            };

                            // Helper function to check if a level should be visible based on parent expansion
                            const shouldShowLevel = (role: string) => {
                                if (role === 'super_duper_master') return true;
                                
                                const roleHierarchy = ['super_duper_master', 'duper_master', 'master', 'agent'];
                                const currentIndex = roleHierarchy.indexOf(role);
                                
                                // Check if all parent levels are expanded
                                for (let i = 0; i < currentIndex; i++) {
                                    const parentRole = roleHierarchy[i];
                                    if (!expandedLevels.has(parentRole)) {
                                        return false;
                                    }
                                }
                                return true;
                            };

                            // Render hierarchy levels
                            const renderHierarchyLevel = (role: string) => {
                                const operators = groupedByRole[role] || [];
                                const isExpanded = expandedLevels.has(role);
                                const nextLevel = getNextLevel(role);
                                const hasChildren = role !== 'agent' && nextLevel;
                                
                                // Only render if this level should be visible
                                if (!shouldShowLevel(role)) return null;
                                
                                // Get amount from summary distribution if no operators exist for this role
                                const amount = operators.length > 0 
                                    ? operators[0].operatorKeeps 
                                    : settlementsData?.summary?.distribution?.[role] || 0;
                                
                                
                                // Use operator name if available, otherwise use a default
                                const operatorName = operators.length > 0 
                                    ? operators[0].operatorName 
                                    : settlementsData?.settlements?.[0]?.chainId || 'N/A';

                                // Get indentation based on role hierarchy
                                const getIndentation = (role: string) => {
                                    switch (role) {
                                        case 'super_duper_master': return 'ml-0';
                                        case 'duper_master': return 'ml-4';
                                        case 'master': return 'ml-8';
                                        case 'agent': return 'ml-12';
                                        default: return 'ml-0';
                                    }
                                };

                            return (
                                    <div key={role} className="space-y-1">
                                        {/* Current Level Header */}
                                        <div 
                                            className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor(role)}`}
                                            onClick={() => hasChildren && toggleExpansion(role)}
                                        >
                                            <div className={`flex items-center space-x-2 ${getIndentation(role)}`}>
                                                {hasChildren && (
                                                    <div className="flex items-center justify-center w-5 h-5">
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                )}
                                                {role !== 'super_duper_master' && (
                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                )}
                                                <span className="font-medium">
                                                    {roleLabels[role as keyof typeof roleLabels]} - {operatorName}
                                                </span>
                                            </div>
                                            <span className={`font-mono text-lg font-bold ${
                                                amount < 0 ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {fmt(amount)}
                                            </span>
                                        </div>

                                            </div>
                                        );
                            };

                            // Always render all hierarchy levels regardless of whether they have operators
                            const allRoles = ['super_duper_master', 'duper_master', 'master', 'agent'];
                            return (
                                <div className="space-y-1">
                                    {allRoles.map(role => renderHierarchyLevel(role))}
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
                            <div className={`text-2xl font-bold ${
                                data.operatorUsersTotals.totalProfit < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
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
