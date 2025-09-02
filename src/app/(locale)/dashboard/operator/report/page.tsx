"use client";

import { useGetOperatorGroupedReport } from "@/react-query/operator-queries";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";
import { OperatorGroupedReportItem } from "@/types/operator-report";
import DataTable from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Helper function to format currency
const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(numAmount);
};

// Parent Shares Component
const ParentSharesCell = ({ parentShares }: { parentShares: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!parentShares || parentShares.length === 0) {
        return <span className="text-gray-400 text-sm">No shares</span>;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="ml-1 text-sm">{parentShares.length} shares</span>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
                {parentShares.map((share, index) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                        <div className="font-medium">{share.parentName}</div>
                        <div className="text-gray-600">
                            {share.percentageShare}% = {formatCurrency(share.shareAmount)}
                        </div>
                        <Badge variant="outline">{share.role}</Badge>
                    </div>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default function OperatorGroupedReportPage() {
    // Set default dates to today
    const todayStr = dayjs().format('YYYY-MM-DD');

    const [startDate, setStartDate] = useState<string>(todayStr);
    const [endDate, setEndDate] = useState<string>(todayStr);
    const [dateError, setDateError] = useState<string>("");

    // Handle start date change with validation
    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        
        // Check if start date is after end date
        if (dayjs(value).isAfter(dayjs(endDate))) {
            setDateError("Start date cannot be later than end date");
        } else {
            setDateError("");
        }
    };

    // Handle end date change with validation
    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        
        // Check if end date is before start date
        if (dayjs(value).isBefore(dayjs(startDate))) {
            setDateError("End date cannot be earlier than start date");
        } else {
            setDateError("");
        }
    };

    // Prepare filter object with start and end of day
    const filter = {
        startDate: dayjs(startDate).startOf('day').toDate(),
        endDate: dayjs(endDate).endOf('day').toDate()
    };

    // Only fetch data if there's no date validation error
    const shouldFetchData = !dateError;
    const { data, isLoading, error } = useGetOperatorGroupedReport(
        shouldFetchData ? filter : undefined
    );

    // Column definitions for the data table
    const columns: ColumnDef<OperatorGroupedReportItem>[] = useMemo(() => [
        {
            accessorKey: "gametype",
            header: "Game Type",
            cell: ({ row }) => (
                <div className="font-medium capitalize">
                    {row.getValue("gametype")}
                </div>
            ),
        },
        {
            accessorKey: "roundrecordgametype",
            header: "Round Type",
            cell: ({ row }) => {
                const roundType = row.getValue("roundrecordgametype") as string | null;
                return roundType ? (
                    <Badge variant="secondary" className="capitalize">
                        {roundType}
                    </Badge>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                );
            },
        },
        {
            accessorKey: "operatorname",
            header: "Operator",
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.getValue("operatorname")}</div>
                    <div className="text-sm text-gray-500">
                        ID: {row.original.operatorid || "Direct"}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "totalplaced",
            header: "Total Placed",
            cell: ({ row }) => (
                <div className="text-right font-mono">
                    {formatCurrency(row.getValue("totalplaced"))}
                </div>
            ),
        },
        {
            accessorKey: "totalwinning",
            header: "Total Winning",
            cell: ({ row }) => (
                <div className="text-right font-mono">
                    {formatCurrency(row.getValue("totalwinning"))}
                </div>
            ),
        },
        {
            accessorKey: "netholding",
            header: "Net Holding",
            cell: ({ row }) => {
                const netHolding = row.getValue("netholding") as number;
                const isPositive = netHolding >= 0;
                return (
                    <div className={`text-right font-mono font-medium ${
                        isPositive ? "text-green-600" : "text-red-600"
                    }`}>
                        <div className="flex items-center justify-end gap-1">
                            {isPositive ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            {formatCurrency(Math.abs(netHolding))}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "parentShares",
            header: "Parent Shares",
            cell: ({ row }) => (
                <ParentSharesCell parentShares={row.getValue("parentShares")} />
            ),
        },
    ], []);

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        if (!data || data.length === 0) return null;

        const totalPlaced = data.reduce((sum, item) => sum + parseFloat(item.totalplaced), 0);
        const totalWinning = data.reduce((sum, item) => sum + parseFloat(item.totalwinning), 0);
        const totalNetHolding = data.reduce((sum, item) => sum + item.netholding, 0);

        return {
            totalPlaced,
            totalWinning,
            totalNetHolding,
            operatorCount: new Set(data.map(item => item.operatorid)).size,
            gameTypeCount: new Set(data.map(item => item.gametype)).size,
        };
    }, [data]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Operator Grouped Report</h1>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Date Range Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Date Validation Error */}
                    {dateError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-600 text-sm font-medium">{dateError}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <p className="text-red-600">Error loading report: {error.message}</p>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {isLoading && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <p className="text-blue-600">Loading report data...</p>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            {summaryStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Placed</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(summaryStats.totalPlaced)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Winning</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatCurrency(summaryStats.totalWinning)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Holding</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${
                                summaryStats.totalNetHolding >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {formatCurrency(summaryStats.totalNetHolding)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Operators</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {summaryStats.operatorCount}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Game Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-600">
                                {summaryStats.gameTypeCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Data Table */}
            {data && data.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Report Details</CardTitle>
                        <p className="text-sm text-gray-600">
                            Showing {data.length} records from {dayjs(startDate).format('MMM DD, YYYY')} to {dayjs(endDate).format('MMM DD, YYYY')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={isLoading}
                        />
                    </CardContent>
                </Card>
            )}

            {/* No Data State */}
            {!isLoading && !error && (!data || data.length === 0) && shouldFetchData && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="text-gray-400 text-center">
                            <DollarSign className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
                            <p className="text-sm">No operator data found for the selected date range.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}