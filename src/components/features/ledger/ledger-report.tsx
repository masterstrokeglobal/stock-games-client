import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLedgerReport } from "@/react-query/ledger-queries";
import dayjs from 'dayjs';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    BarChart3,
    Calculator,
    PieChart
} from "lucide-react";
import React, { useState } from 'react';

// Define TypeScript interface for the data
interface LedgerReportData {
    totalReceived: number;
    totalPaid: number;
    stockShareAmount: number;
    casinoShareAmount: number;
    totalShareAmount: number;
    totalReceivedWithFilter: number;
    totalPaidWithFilter: number;
    stockShareAmountWithFilter: number;
    casinoShareAmountWithFilter: number;
    totalShareAmountWithFilter: number;
}


type LedgerReportProps = {
    companyId?: string;
}

const LedgerReport = ({ companyId }: LedgerReportProps) => {
    const [filter, setFilter]    = useState<{startDate: Date, endDate: Date}>({startDate: dayjs().startOf('month').toDate(), endDate: dayjs().endOf('month').toDate()});
    const { data, isLoading } = useGetLedgerReport({companyId: companyId ?? "", startDate: filter.startDate, endDate: filter.endDate});

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const ledgerData: LedgerReportData = data?.data || {
        totalReceived: 0,
        totalPaid: 0,
        stockShareAmount: 0,
        casinoShareAmount: 0,
        totalShareAmount: 0,
        totalReceivedWithFilter: 0,
        totalPaidWithFilter: 0,
        stockShareAmountWithFilter: 0,
        casinoShareAmountWithFilter: 0,
        totalShareAmountWithFilter: 0
    };

    // Format currency numbers
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate financial totals
    const totalAmountWithTransactions = ledgerData.totalShareAmount - ledgerData.totalReceived + ledgerData.totalPaid;

    return (
        <div className="space-y-6">
            {/* Overview Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between"> 
                        <CardTitle className="text-2xl font-bold">Ledger Summary</CardTitle>
                        <div className="flex gap-2 items-center">
                        <Input type="date" value={dayjs(filter.startDate).format('YYYY-MM-DD')} onChange={(e) => setFilter({ ...filter, startDate: new Date(e.target.value) })} />
                        <span className="text-muted-foreground">to</span>
                        <Input type="date" value={dayjs(filter.endDate).format('YYYY-MM-DD')} onChange={(e) => setFilter({ ...filter, endDate: new Date(e.target.value) })} />
                    </div>

                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={<ArrowUpCircle className="text-green-500" />}
                            title="Total Received"
                            value={formatCurrency(ledgerData.totalReceivedWithFilter)}
                            color="bg-green-100"
                        />
                        <StatCard
                            icon={<ArrowDownCircle className="text-red-500" />}
                            title="Total Paid"
                            value={formatCurrency(ledgerData.totalPaidWithFilter)}
                            color="bg-red-100"
                        />
                        <StatCard
                            icon={<Calculator className="text-purple-500" />}
                            title="Total Balance"
                            value={formatCurrency(totalAmountWithTransactions)}
                            color="bg-purple-100"
                            tooltip="Total Share Amount - Received + Paid"
                        />
                        <StatCard
                            icon={<Calculator className="text-blue-500" />}
                            title="Total Share Amount"
                            value={formatCurrency(ledgerData.totalShareAmountWithFilter)}
                            color="bg-purple-100"
                            tooltip="Total Share Amount"
                        />
                    </div>

                    {/* Accordion for Details */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="ledger-details">
                            <AccordionTrigger className="text-lg font-medium">
                                Life Time Breakdown
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-6 pt-2">
                                    {/* Share Distribution */}
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Share Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <ShareRow
                                                    label="Stock Share"
                                                    amount={ledgerData.stockShareAmount}
                                                    total={ledgerData.totalShareAmount || 1}
                                                    icon={<BarChart3 className="text-purple-500" />}
                                                />
                                                <ShareRow
                                                    label="Casino Share"
                                                    amount={ledgerData.casinoShareAmount}
                                                    total={ledgerData.totalShareAmount || 1}
                                                    icon={<PieChart className="text-orange-500" />}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Total Share Amount */}
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Financial Totals</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center py-2 border-b">
                                                    <span className="font-medium">Total Share Amount</span>
                                                    <span className="font-bold">{formatCurrency(ledgerData.totalShareAmount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b">
                                                    <span className="font-medium text-green-600">Total Received (subtracted)</span>
                                                    <span className="font-bold text-green-600">- {formatCurrency(ledgerData.totalReceived)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b">
                                                    <span className="font-medium text-red-600">Total Paid (added)</span>
                                                    <span className="font-bold text-red-600">+ {formatCurrency(ledgerData.totalPaid)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 mt-2 bg-purple-50 rounded-lg p-2">
                                                    <span className="font-bold">Final Total</span>
                                                    <span className="font-bold text-xl">{formatCurrency(totalAmountWithTransactions)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </CardFooter>
            </Card>
        </div>
    );
};

// Helper component for stat cards
interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
    tooltip?: string;
}

const StatCard = ({ icon, title, value, color, tooltip }: StatCardProps) => (
    <div className={`rounded-lg p-4 flex items-center space-x-4 ${color}`} title={tooltip}>
        <div className="p-2 rounded-full bg-white">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

// Helper component for share rows
interface ShareRowProps {
    label: string;
    amount: number;
    total: number;
    icon: React.ReactNode;
}

const ShareRow = ({ label, amount, total, icon }: ShareRowProps) => {
    const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <div className="text-right">
                    <span className="font-bold">
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(amount)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                </div>
            </div>
        </div>
    );
};

export default LedgerReport;