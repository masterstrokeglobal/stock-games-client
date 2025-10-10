"use client";

import React, { useMemo } from "react";
import BetHistoryTable from "@/components/features/bet-history/bet-history-table";
import BetStatisticsCards from "@/components/features/bet-history/bet-statistics-cards";
import { useGetBetStatistics } from "@/react-query/bet-history-queries";
import { BetStatistics } from "@/models/bet-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BetHistoryPage = () => {
    // Statistics without filters - shows ALL bets
    const { data: statisticsData, isLoading: statsLoading } = useGetBetStatistics({});

    const statistics = useMemo(() => {
        if (statisticsData?.data?.data) {
            return new BetStatistics(statisticsData.data.data);
        }
        return null;
    }, [statisticsData]);

    return (
        <div className="container-main min-h-screen py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">CRM Bet History</h1>
                <p className="text-gray-600">
                    View and analyze all user bets across all game types
                </p>
            </div>

            <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="history">Bet History</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-6">
                    <BetHistoryTable />
                </TabsContent>

                <TabsContent value="statistics" className="mt-6">
                    <BetStatisticsCards 
                        statistics={statistics} 
                        loading={statsLoading} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BetHistoryPage;

