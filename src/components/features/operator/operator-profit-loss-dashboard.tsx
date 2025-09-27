"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetCurrentOperator, useGetSettlements } from "@/react-query/operator-queries";
import { RefreshCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/common/loading-screen";
import { useState } from "react";
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
    const [agentId, setAgentId] = useState<string>("");
    const [aggregate, setAggregate] = useState<boolean>(true);

    const { data: currentOperator } = useGetCurrentOperator();
    const isAdmin = currentOperator?.role?.toLowerCase() === 'company_admin';

    // Get settlements data
    const { data: settlementsData, isLoading, error, refetch } = useGetSettlements({
        startDate: dateRange?.from,
        endDate: dateRange?.to,
        agentId: agentId ? parseInt(agentId) : undefined,
        aggregate
    });

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

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Settlement Report</h1>
                    <p className="text-gray-600">View settlement data for your operator hierarchy</p>
                </div>
                <div className="flex items-center gap-4">
                    <DatePickerWithRange
                        initialDateRange={dateRange}
                        onDateChange={setDateRange}
                        className="w-fit"
                    />
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Agent Filter</label>
                            <Input
                                placeholder="Agent ID (optional)"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="aggregate"
                                checked={aggregate}
                                onChange={(e) => setAggregate(e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="aggregate" className="text-sm font-medium text-gray-700">
                                Show Summary
                            </label>
                        </div>
                        <Button
                            onClick={() => {
                                // TODO: Implement export functionality
                                console.log('Export settlements');
                            }}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Settlement Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Settlement Data</CardTitle>
                    <CardDescription>
                        Showing data for {dayjs(dateRange?.from).format('DD MMM YYYY')} - {dayjs(dateRange?.to).format('DD MMM YYYY')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {settlementsData ? (
                        <div className="space-y-4">
                            {/* Summary Card (if aggregate is enabled) */}
                            {aggregate && settlementsData.summary && (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Total Recharge:</span>
                                                <div className="font-semibold text-green-600">
                                                    ₹{settlementsData.summary.totalRecharge?.toLocaleString() || 0}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Total Redeem:</span>
                                                <div className="font-semibold text-red-600">
                                                    ₹{settlementsData.summary.totalRedeem?.toLocaleString() || 0}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Net:</span>
                                                <div className={`font-semibold ${(settlementsData.summary.net || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{settlementsData.summary.net?.toLocaleString() || 0}
                                                </div>
                                            </div>
                                            {isAdmin && (
                                                <div>
                                                    <span className="text-gray-600">Company Share:</span>
                                                    <div className="font-semibold text-blue-600">
                                                        ₹{settlementsData.summary.companyShare?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Settlement Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Agent</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Total Recharge</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Total Redeem</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Net</th>
                                            {isAdmin && (
                                                <th className="border border-gray-300 px-4 py-2 text-right">Company Share</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {settlementsData.data?.map((settlement: any, index: number) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div>
                                                        <div className="font-medium">{settlement.agentName || `Agent #${settlement.agentId}`}</div>
                                                        <div className="text-sm text-gray-500">ID: {settlement.agentId}</div>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-right text-green-600">
                                                    ₹{settlement.totalRecharge?.toLocaleString() || 0}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-right text-red-600">
                                                    ₹{settlement.totalRedeem?.toLocaleString() || 0}
                                                </td>
                                                <td className={`border border-gray-300 px-4 py-2 text-right font-semibold ${(settlement.net || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{settlement.net?.toLocaleString() || 0}
                                                </td>
                                                {isAdmin && (
                                                    <td className="border border-gray-300 px-4 py-2 text-right text-blue-600">
                                                        ₹{settlement.companyShare?.toLocaleString() || 0}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {(!settlementsData.data || settlementsData.data.length === 0) && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No settlement data found for the selected period.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Loading settlement data...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OperatorProfitLossDashboard;