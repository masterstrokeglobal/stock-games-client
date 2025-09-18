"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetOperatorWalletBalance } from "@/react-query/operator-queries";
import { Wallet, TrendingUp, TrendingDown, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import LoadingScreen from "@/components/common/loading-screen";
import { Button } from "@/components/ui/button";

type Props = {
    operatorId: number;
    className?: string;
};

interface WalletBalance {
    id: number;
    currentBalance: number;
    currency: string;
    lastUpdated: string;
    recentTransactions: Array<{
        id: number;
        amount: number;
        type: string;
        status: string;
        createdAt: string;
        description?: string;
        depositorOperatorWallet?: any;
        creditorOperatorWallet?: any;
    }>;
    summary: {
        totalCredits: number;
        totalDebits: number;
        netChange: number;
        transactionCount: number;
    };
}

const OperatorWalletBalance = ({ operatorId, className }: Props) => {
    const { data: walletData, isLoading, error, refetch, isRefetching } = useGetOperatorWalletBalance(operatorId);

    if (isLoading) {
        return <LoadingScreen className="h-64" />;
    }

    if (error) {
        return (
            <div className={cn("p-6 text-center", className)}>
                <div className="text-red-500 mb-4">Error loading wallet balance</div>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    // Normalize API response to expected shape
    const normalizeNumber = (value: any): number => {
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    const raw: any = (walletData as any)?.data?.data || (walletData as any)?.data || walletData || {};
    const walletContainer: any = raw?.wallet ?? raw; // API may return { wallet: { balance } }
    const recentTransactions: any[] = raw?.recentTransactions ?? walletContainer?.recentTransactions ?? [];

    const wallet: WalletBalance = {
        id: walletContainer?.id ?? walletContainer?.operatorWallet?.id, 
        currentBalance: normalizeNumber(
            walletContainer?.currentBalance ?? walletContainer?.balance ?? walletContainer?.operatorWallet?.balance
        ),
        currency: walletContainer?.currency ?? "INR",
        lastUpdated: walletContainer?.lastUpdated ?? walletContainer?.updatedAt ?? recentTransactions?.[0]?.updatedAt ?? new Date().toISOString(),
        recentTransactions,
        summary: {
            totalCredits: normalizeNumber(raw?.summary?.totalCredits ?? raw?.totalCredits),
            totalDebits: normalizeNumber(raw?.summary?.totalDebits ?? raw?.totalDebits),
            netChange: normalizeNumber(raw?.summary?.netChange ?? raw?.netChange),
            transactionCount: raw?.summary?.transactionCount ?? raw?.transactionCount ?? recentTransactions.length ?? 0,
        },
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Main Balance Card */}
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50" />
                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Wallet className="h-6 w-6 text-blue-600" />
                            <CardTitle className="text-xl">Wallet Balance</CardTitle>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isRefetching}
                        >
                            <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
                        </Button>
                    </div>
                    <CardDescription>
                        Last updated: {dayjs(wallet?.lastUpdated).format("DD MMM YYYY, HH:mm")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <div className="text-3xl font-bold text-gray-900">
                        ₹{Number(wallet?.currentBalance || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        Available Balance
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Total Credits</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            ₹{Number(wallet?.summary?.totalCredits || 0).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">Total Debits</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            ₹{Number(wallet?.summary?.totalDebits || 0).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Net Change</span>
                        </div>
                        <div className={cn(
                            "text-xl font-bold",
                            (wallet?.summary?.netChange || 0) >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {(wallet?.summary?.netChange || 0) >= 0 ? "+" : ""}₹{Number(wallet?.summary?.netChange || 0).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Wallet className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium">Transactions</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            {wallet?.summary?.transactionCount || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            {wallet?.recentTransactions && wallet.recentTransactions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                        <CardDescription>Last 10 wallet transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {wallet.recentTransactions.map((transaction) => {
                                const isDebit = transaction.creditorOperatorWallet?.id === wallet.id;
                                
                                return (
                                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                transaction.status === 'completed' ? "bg-green-500" :
                                                transaction.status === 'pending' ? "bg-yellow-500" : "bg-red-500"
                                            )} />
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {transaction.description || transaction.type.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {dayjs(transaction.createdAt).format("DD MMM, HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "font-medium",
                                                isDebit ? "text-green-600" : "text-red-600"
                                            )}>
                                                {isDebit ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                                            </div>
                                            <Badge 
                                                variant={
                                                    transaction.status === 'completed' ? 'success' :
                                                    transaction.status === 'pending' ? 'warning' : 'destructive'
                                                }
                                                className="text-xs"
                                            >
                                                {transaction.status.toLowerCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default OperatorWalletBalance;
