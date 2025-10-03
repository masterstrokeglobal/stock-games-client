"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCurrentOperator, useGetSettlements } from "@/react-query/operator-queries";
import { RefreshCw, ChevronDown, ChevronRight, Building, TrendingUp, Users, PieChart } from "lucide-react";
import { INR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type Props = {
    operatorId?: number;
    className?: string;
};

const OperatorProfitLossDashboard = ({ className }: Props) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: dayjs().subtract(7, 'day').toDate(),
        to: new Date()
    });
    
    // State for managing dropdown expansions - will be initialized dynamically
    const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
    
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

    const { data: currentOperator } = useGetCurrentOperator();
    const isAdmin = currentOperator?.role?.toLowerCase() === 'company_admin';

    // Memoize filter parameters to prevent infinite re-renders
    const filterParams = useMemo(() => {
        // Group by the logged-in operator's own role to combine children under them
        const role = (currentOperator?.role as string | undefined) || '';
        const validRoles = ['super_duper_master','duper_master','master','agent'] as const;
        const isValidRole = (validRoles as readonly string[]).includes(role);
        const groupBy = isValidRole ? (role as typeof validRoles[number]) : (isAdmin ? 'super_duper_master' : undefined);
        return {
        startDate: dateRange?.from,
        endDate: dateRange?.to,
            aggregate: true,
            groupBy,
            includeEmpty: true,
        };
    }, [dateRange?.from, dateRange?.to, currentOperator?.role, isAdmin]);

    // Get settlements data
    const { data: settlementsData, isLoading, error, refetch, isRefetching } = useGetSettlements({ ...filterParams, hierarchical: true });

    // Auto-expand all nodes so the full hierarchy is visible by default
    useEffect(() => {
        const settlements = settlementsData?.settlements as any[] | undefined;
        if (!settlements || !settlements.length) return;

        const initial = new Set<string>();
        settlements.forEach((s: any) => {
            // Handle shape: direct duperMaster root
            const dmId = s.duperMaster?.id ?? s.duperMaster;
            if (dmId !== undefined && dmId !== null) initial.add(`duper_master-${dmId}`);
            (s.masters || []).forEach((m: any) => {
                const mId = m.master?.id ?? m.master;
                if (mId !== undefined && mId !== null) initial.add(`master-${mId}`);
            });

            // Handle shape: superDuperMaster with duperMasters[]
            (s.duperMasters || []).forEach((dm: any) => {
                const dmId2 = dm.duperMaster?.id ?? dm.duperMaster;
                if (dmId2 !== undefined && dmId2 !== null) initial.add(`duper_master-${dmId2}`);
                (dm.masters || []).forEach((m: any) => {
                    const mId2 = m.master?.id ?? m.master;
                    if (mId2 !== undefined && mId2 !== null) initial.add(`master-${mId2}`);
                });
            });
        });

        setExpandedLevels(initial);
    }, [settlementsData]);

    if (isLoading) {
        return <LoadingScreen className="h-64" />;
    }

    if (error) {
        return (
            <div className={cn("p-6 text-center", className)}>
                <div className="text-red-500 mb-4">Error loading settlement data</div>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    // Map settlements API response to admin-style format
    const data = settlementsData ? {
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
            const hierarchy = [];
            
            // Only create hierarchy levels that exist in the distribution data
            const roleHierarchy = ['super_duper_master', 'duper_master', 'master', 'agent'];
            
            for (const role of roleHierarchy) {
                if (distributions[role] !== undefined) {
                    hierarchy.push({
                        operatorId: settlement.agentId || 0,
                        operatorName: settlement.chainId || `Agent #${settlement.agentId}`,
                        role: role,
                        allocatedPercentage: 0,
                        directProfit: role === 'super_duper_master' ? (settlement.net || 0) : 0,
                        receivesFromParent: 0,
                        totalOperatorAmount: distributions[role] || 0,
                        distributesToChildren: 0,
                        operatorKeeps: distributions[role] || 0,
                    });
                }
            }
            
            return hierarchy;
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
                        <Users className="h-6 w-6" />
                        {isAdmin ? "Operator Profit Distribution" : "Settlement Report"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {isAdmin ? "View profit distribution for your operator hierarchy" : "View settlement data for your operator hierarchy"}
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

            {/* Show admin-specific sections only for admins */}
            {isAdmin && (
                <>
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
                </>
            )}

            {/* Operator Summary (shown for all users) */}
            {!isAdmin && settlementsData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Settlement Summary
                        </CardTitle>
                        <CardDescription>
                            Showing data for {dayjs(dateRange?.from).format('DD MMM YYYY')} - {dayjs(dateRange?.to).format('DD MMM YYYY')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium">Total Placed</span>
                                    </div>
                                    <div className="text-xl font-bold text-blue-600">
                                        ₹{settlementsData.summary?.totalPlacement?.toLocaleString() || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Total amount placed</div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Net Wins</span>
                                    </div>
                                    <div className="text-xl font-bold text-green-600">
                                        ₹{settlementsData.summary?.totalWinning?.toLocaleString() || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Total winnings</div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <PieChart className={`h-4 w-4 ${(settlementsData.summary?.net || 0) < 0 ? 'text-red-600' : 'text-green-600'}`} />
                                        <span className="text-sm font-medium">Profit</span>
                                    </div>
                                    <div className={`text-xl font-bold ${
                                        (settlementsData.summary?.net || 0) < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        ₹{settlementsData.summary?.net?.toLocaleString() || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Net profit/loss</div>
                                </CardContent>
                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

            {/* Hierarchy Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {isAdmin ? "Operator Hierarchy Distribution" : "Settlement Distribution"}
                    </CardTitle>
                    <CardDescription>
                        {isAdmin 
                            ? "Profit distribution from top-level (Super Duper Master) to bottom-level (Agent)"
                            : "Settlement amounts for each role in your hierarchy"
                        }
                    </CardDescription>
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

                            const getRoleColor = (role: string) => {
                                switch (role) {
                                    case 'super_duper_master': return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
                                    case 'duper_master': return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
                                    case 'master': return 'border-green-200 bg-green-50 hover:bg-green-100';
                                    case 'agent': return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
                                    default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
                                }
                            };

                            const settlements = settlementsData?.settlements || [];
                            if (!settlements.length) {
                                return <div className="text-sm text-gray-500">No settlement chains available</div>;
                            }

                            const renderHierarchical = (s: any) => {
                                const getDisplayName = (entity: any, roleLabel: string) => {
                                    if (!entity) return `${roleLabel} (unknown)`;
                                    if (typeof entity === 'string') return entity;
                                    const name = entity?.name;
                                    const id = entity?.id;
                                    if (name && String(name).trim().length > 0) return name;
                                    if (id !== undefined && id !== null) return `${roleLabel} #${id}`;
                                    return `${roleLabel} (unknown)`;
                                };
                                // Handle duper master → masters → agents structure
                                if (s?.duperMaster && Array.isArray(s?.masters)) {
                                    const currentIdRaw = (currentOperator as any)?.id;
                                    const currentId = currentIdRaw !== undefined && currentIdRaw !== null ? Number(currentIdRaw) : undefined;
                                    const currentRole = (currentOperator?.role as string | undefined) || '';
                                    
                                    // For master role: show only master and agents
                                    if (currentRole === 'master' && currentId !== undefined) {
                                        const masterNodes = s.masters.filter((m: any) => {
                                            const mId = m.master?.id ?? m.master;
                                            return Number(mId) === currentId;
                                        });
                                        
                                        return (
                                            <div className="space-y-2">
                                                {masterNodes.map((m: any) => {
                                                    const mKey = `master-${m.master?.id ?? m.master}`;
                                                    const mAmount = (m.distribution?.master ?? m.net ?? 0) as number;
                                                    const isMasterExpanded = expandedLevels.has(mKey);
                                                    return (
                                                        <div key={mKey} className="space-y-1">
                                                            <div
                                                                className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor('master')}`}
                                                                onClick={() => toggleExpansion(mKey)}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="flex items-center justify-center w-5 h-5">
                                                                        {isMasterExpanded ? (
                                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                                        ) : (
                                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium">Master - {getDisplayName(m.master, 'Master')}</span>
                                                                </div>
                                                                <span className={`font-mono text-lg font-bold ${mAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {fmt(mAmount)}
                                                                </span>
                                                            </div>

                                                            {isMasterExpanded && Array.isArray(m.agents) && (
                                                                <div className="ml-4 space-y-1">
                                                                    {m.agents.map((a: any) => {
                                                                        const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                                        return (
                                                                            <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-2 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                                                <span className="text-sm">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                                                <span className={`font-mono text-sm ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                    
                                    // For agent role: show only agent
                                    if (currentRole === 'agent' && currentId !== undefined) {
                                        const agentNodes: any[] = [];
                                        s.masters.forEach((m: any) => {
                                            (m.agents || []).forEach((a: any) => {
                                                const aId = a.agent?.id ?? a.agent;
                                                if (Number(aId) === currentId) {
                                                    agentNodes.push(a);
                                                }
                                            });
                                        });
                                        
                                        return (
                                            <div className="space-y-2">
                                                {agentNodes.map((a: any) => {
                                                    const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                    return (
                                                        <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-3 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                            <span className="font-medium">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                            <span className={`font-mono text-lg font-bold ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                    
                                    // For duper_master: show duper master and below
                                    const topKey = `duper_master-${s.duperMaster.id}`;
                                    const headerAmount = (s.distribution?.duper_master ?? s.net ?? 0) as number;
                                    const isTopExpanded = expandedLevels.has(topKey);
                                    return (
                                        <div key={topKey} className="space-y-1">
                                            <div
                                                className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor('duper_master')}`}
                                                onClick={() => toggleExpansion(topKey)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-5 h-5">
                                                        {isTopExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium">Duper Master - {getDisplayName(s.duperMaster, 'Duper Master')}</span>
                                                </div>
                                                <span className={`font-mono text-lg font-bold ${headerAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {fmt(headerAmount)}
                                                </span>
                                            </div>

                                            {isTopExpanded && (
                                                <div className="ml-4 space-y-1">
                                                    {s.masters.map((m: any) => {
                                                        const mKey = `master-${m.master?.id ?? m.master}`;
                                                        const mAmount = (m.distribution?.master ?? m.net ?? 0) as number;
                                                        const isMasterExpanded = expandedLevels.has(mKey);
                                                        return (
                                                            <div key={mKey} className="space-y-1">
                                                                <div
                                                                    className={`flex items-center justify-between p-2 rounded border-l-4 cursor-pointer ${getRoleColor('master')}`}
                                                                    onClick={() => toggleExpansion(mKey)}
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="flex items-center justify-center w-5 h-5">
                                                                            {isMasterExpanded ? (
                                                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                                                            ) : (
                                                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                            )}
                                                                        </div>
                                                                        <span className="text-sm">Master - {getDisplayName(m.master, 'Master')}</span>
                                                                    </div>
                                                                    <span className={`font-mono text-sm ${mAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(mAmount)}</span>
                                                                </div>

                                                                {isMasterExpanded && Array.isArray(m.agents) && (
                                                                    <div className="ml-4 space-y-1">
                                                                        {m.agents.map((a: any) => {
                                                                            const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                                            return (
                                                                                <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-2 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                                                    <span className="text-sm">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                                                    <span className={`font-mono text-sm ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                // Handle super duper master → duperMasters → masters → agents
                                if (s?.superDuperMaster && Array.isArray(s?.duperMasters)) {
                                    const currentIdRaw = (currentOperator as any)?.id;
                                    const currentId = currentIdRaw !== undefined && currentIdRaw !== null ? Number(currentIdRaw) : undefined;
                                    const currentRole = (currentOperator?.role as string | undefined) || '';
                                    
                                    // For master role: render only master and agents (skip duper master)
                                    if (currentRole === 'master' && currentId !== undefined) {
                                        const masterNodes: any[] = [];
                                        s.duperMasters.forEach((dm: any) => {
                                            (dm.masters || []).forEach((m: any) => {
                                                const mId = m.master?.id ?? m.master;
                                                if (Number(mId) === currentId) {
                                                    masterNodes.push(m);
                                                }
                                            });
                                        });
                                        
                                        return (
                                            <div className="space-y-2">
                                                {masterNodes.map((m: any) => {
                                                    const mKey = `master-${m.master?.id ?? m.master}`;
                                                    const mAmount = (m.distribution?.master ?? m.net ?? 0) as number;
                                                    const isMasterExpanded = expandedLevels.has(mKey);
                                                    return (
                                                        <div key={mKey} className="space-y-1">
                                                            <div
                                                                className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor('master')}`}
                                                                onClick={() => toggleExpansion(mKey)}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="flex items-center justify-center w-5 h-5">
                                                                        {isMasterExpanded ? (
                                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                                        ) : (
                                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium">Master - {getDisplayName(m.master, 'Master')}</span>
                                                                </div>
                                                                <span className={`font-mono text-lg font-bold ${mAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {fmt(mAmount)}
                                                                </span>
                                                            </div>

                                                            {isMasterExpanded && Array.isArray(m.agents) && (
                                                                <div className="ml-4 space-y-1">
                                                                    {m.agents.map((a: any) => {
                                                                        const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                                        return (
                                                                            <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-2 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                                                <span className="text-sm">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                                                <span className={`font-mono text-sm ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                    
                                    // For agent role: render only agent
                                    if (currentRole === 'agent' && currentId !== undefined) {
                                        const agentNodes: any[] = [];
                                        s.duperMasters.forEach((dm: any) => {
                                            (dm.masters || []).forEach((m: any) => {
                                                (m.agents || []).forEach((a: any) => {
                                                    const aId = a.agent?.id ?? a.agent;
                                                    if (Number(aId) === currentId) {
                                                        agentNodes.push(a);
                                                    }
                                                });
                                            });
                                        });
                                        
                                        return (
                                            <div className="space-y-2">
                                                {agentNodes.map((a: any) => {
                                                    const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                    return (
                                                        <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-3 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                            <span className="font-medium">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                            <span className={`font-mono text-lg font-bold ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                    
                                    // For duper_master role or admin: show duper master and below
                                    let duperMasters: any[] = s.duperMasters;
                                    
                                    if (currentRole === 'duper_master' && currentId !== undefined && !isAdmin) {
                                        duperMasters = duperMasters.filter((dm) => {
                                            const dmIdRaw = dm.duperMaster?.id ?? dm.duperMaster;
                                            const dmId = dmIdRaw !== undefined && dmIdRaw !== null ? Number(dmIdRaw) : undefined;
                                            return dmId === currentId;
                                        });
                                    }
                                    
                                    if (duperMasters.length === 0) duperMasters = s.duperMasters;

                                    return (
                                        <div key={`sdm-${s.superDuperMaster.id}`} className="space-y-2">
                                            {duperMasters.map((dm: any) => {
                                                const topKey = `duper_master-${dm.duperMaster?.id ?? dm.duperMaster}`;
                                                const headerAmount = (dm.distribution?.duper_master ?? dm.net ?? 0) as number;
                                                const isTopExpanded = expandedLevels.has(topKey);
                                                return (
                                                    <div key={topKey} className="space-y-1">
                                                        <div
                                                            className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor('duper_master')}`}
                                                            onClick={() => toggleExpansion(topKey)}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <div className="flex items-center justify-center w-5 h-5">
                                                                    {isTopExpanded ? (
                                                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                                                    ) : (
                                                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                    )}
                                                                </div>
                                                                <span className="font-medium">Duper Master - {getDisplayName(dm.duperMaster, 'Duper Master')}</span>
                                                            </div>
                                                            <span className={`font-mono text-lg font-bold ${headerAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                {fmt(headerAmount)}
                                                            </span>
                                                        </div>

                                                        {isTopExpanded && (
                                                            <div className="ml-4 space-y-1">
                                                                {(dm.masters || []).map((m: any) => {
                                                                    const mKey = `master-${m.master?.id ?? m.master}`;
                                                                    const mAmount = (m.distribution?.master ?? m.net ?? 0) as number;
                                                                    const isMasterExpanded = expandedLevels.has(mKey);
                                                                    return (
                                                                        <div key={mKey} className="space-y-1">
                                                                            <div
                                                                                className={`flex items-center justify-between p-2 rounded border-l-4 cursor-pointer ${getRoleColor('master')}`}
                                                                                onClick={() => toggleExpansion(mKey)}
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <div className="flex items-center justify-center w-5 h-5">
                                                                                        {isMasterExpanded ? (
                                                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                                                        ) : (
                                                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                                        )}
                                                                                    </div>
                                                                                    <span className="text-sm">Master - {getDisplayName(m.master, 'Master')}</span>
                                                                                </div>
                                                                                <span className={`font-mono text-sm ${mAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(mAmount)}</span>
                                                                            </div>

                                                                            {isMasterExpanded && Array.isArray(m.agents) && (
                                                                                <div className="ml-4 space-y-1">
                                                                                    {m.agents.map((a: any) => {
                                                                                        const aAmount = (a.distribution?.agent ?? a.net ?? 0) as number;
                                                                                        return (
                                                                                            <div key={`agent-${a.agent?.id ?? a.agent}`} className={`flex items-center justify-between p-2 rounded border-l-4 ${getRoleColor('agent')}`}>
                                                                                                <span className="text-sm">Agent - {getDisplayName(a.agent, 'Agent')}</span>
                                                                                                <span className={`font-mono text-sm ${aAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>{fmt(aAmount)}</span>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }

                                // Fallback to flat role-based rendering
                                const chainKey = s.chainId || `Agent #${s.agentId}`;
                                const dist = s.distribution || {};
                                const hierarchy: Array<'super_duper_master' | 'duper_master' | 'master' | 'agent'> = ['super_duper_master','duper_master','master','agent'];
                                const topRole = hierarchy.find((r) => dist[r] !== undefined) || 'agent';
                                const headerAmount = dist[topRole] ?? 0;
                                const isExpanded = expandedLevels.has(chainKey);
                                return (
                                    <div key={chainKey} className="space-y-1">
                                        <div 
                                            className={`flex items-center justify-between p-3 rounded border-l-4 cursor-pointer transition-colors ${getRoleColor(topRole)}`}
                                            onClick={() => toggleExpansion(chainKey)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-5 h-5">
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                <span className="font-medium">
                                                    {roleLabels[topRole]} - {chainKey}
                                                </span>
                                            </div>
                                            <span className={`font-mono text-lg font-bold ${headerAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {fmt(headerAmount)}
                                            </span>
                                        </div>

                                        {isExpanded && (
                                            <div className="ml-4 space-y-1">
                                                {hierarchy.slice(hierarchy.indexOf(topRole) + 1).filter((role) => dist[role] !== undefined).map((role) => (
                                                    <div key={`${chainKey}-${role}`} className={`flex items-center justify-between p-2 rounded border-l-4 ${getRoleColor(role)}`}>
                                                        <span className="text-sm">{roleLabels[role]}</span>
                                                        <span className={`font-mono text-sm ${(dist[role] || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {fmt(dist[role] || 0)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                            </div>
                                );
                            };

                            return (
                                <div className="space-y-2">
                                    {settlements.map((s: any) => renderHierarchical(s))}
                                </div>
                            );
                        })()}
                        </div>
                </CardContent>
            </Card>

            {/* Summary - Admin only */}
            {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Summary
                        </CardTitle>
                        <CardDescription>Overall profit distribution summary</CardDescription>
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
            )}
        </div>
    );
};

export default OperatorProfitLossDashboard;