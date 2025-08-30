"use client";

import DataTable from "@/components/ui/data-table";
import reportColumns from "@/columns/report-columns";
import { useMemo } from "react";

type ReportItem = {
    gametype: string;
    roundrecordgametype: string;
    userid: number;
    username: string;
    totalplaced: string;
    totalwinning: string;
    netholding: number;
    percentageShare: number;
    shareAmount: number;
}

interface ReportTableProps {
    data: ReportItem[];
    isLoading?: boolean;
}

const ReportTable = ({ data, isLoading }: ReportTableProps) => {
    // Calculate summary data
    const summaryData = useMemo(() => {
        if (!data || data.length === 0) return null;
        
        return {
            totalPlaced: data.reduce((sum, item) => sum + parseFloat(item.totalplaced), 0),
            totalWinning: data.reduce((sum, item) => sum + parseFloat(item.totalwinning), 0),
            netHolding: data.reduce((sum, item) => sum + item.netholding, 0),
            totalShareAmount: data.reduce((sum, item) => sum + item.shareAmount, 0),
        };
    }, [data]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading report...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summaryData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-900">Total Placed</h4>
                        <p className="text-lg font-semibold text-blue-600">
                            ₹{summaryData.totalPlaced.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-900">Total Winning</h4>
                        <p className="text-lg font-semibold text-green-600">
                            ₹{summaryData.totalWinning.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-900">Net Holding</h4>
                        <p className={`text-lg font-semibold ${summaryData.netHolding >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{summaryData.netHolding.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="text-sm font-medium text-orange-900">Total Share Amount</h4>
                        <p className={`text-lg font-semibold ${summaryData.totalShareAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{summaryData.totalShareAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg border">
                <DataTable
                    columns={reportColumns}
                    data={data || []}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default ReportTable;
