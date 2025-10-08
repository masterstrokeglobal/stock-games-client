"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BetStatistics } from "@/models/bet-history";
import { 
    TrendingUp, 
    DollarSign, 
    Trophy, 
    XCircle,
    Percent
} from "lucide-react";

interface BetStatisticsCardsProps {
    statistics: BetStatistics | null;
    loading?: boolean;
}

const BetStatisticsCards = ({ statistics, loading }: BetStatisticsCardsProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border shadow-sm animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={<TrendingUp className="text-blue-600 w-6 h-6" />}
                    label="Total Bets"
                    value={statistics.totalBets.toLocaleString()}
                    bgColor="bg-blue-50"
                    textColor="text-blue-800"
                />

                <StatCard
                    icon={<DollarSign className="text-purple-600 w-6 h-6" />}
                    label="Total Wagered"
                    value={`₹${statistics.totalWagered.toLocaleString()}`}
                    bgColor="bg-purple-50"
                    textColor="text-purple-800"
                />

                <StatCard
                    icon={<Trophy className="text-green-600 w-6 h-6" />}
                    label="Total Wins"
                    value={statistics.totalWins.toLocaleString()}
                    bgColor="bg-green-50"
                    textColor="text-green-800"
                />

                <StatCard
                    icon={<XCircle className="text-red-600 w-6 h-6" />}
                    label="Total Losses"
                    value={statistics.totalLosses.toLocaleString()}
                    bgColor="bg-red-50"
                    textColor="text-red-800"
                />

                <StatCard
                    icon={<Percent className="text-yellow-600 w-6 h-6" />}
                    label="Win Rate"
                    value={statistics.winRate}
                    bgColor="bg-yellow-50"
                    textColor="text-yellow-800"
                />
            </div>

            {/* Game Type Breakdown */}
            {statistics.betsByGameType && Object.keys(statistics.betsByGameType).length > 0 && (
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Breakdown by Game Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(statistics.betsByGameType).map(([gameType, stats]) => (
                                <div 
                                    key={gameType}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 capitalize">
                                            {gameType}
                                        </h4>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                            <span>Bets: {stats.count}</span>
                                            <span>Wagered: ₹{stats.totalWagered.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-green-600 font-semibold">
                                                {stats.wins}
                                            </div>
                                            <div className="text-gray-500 text-xs">Wins</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-red-600 font-semibold">
                                                {stats.losses}
                                            </div>
                                            <div className="text-gray-500 text-xs">Losses</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-blue-600 font-semibold">
                                                {stats.count > 0 
                                                    ? ((stats.wins / stats.count) * 100).toFixed(1) 
                                                    : "0"}%
                                            </div>
                                            <div className="text-gray-500 text-xs">Win Rate</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const StatCard = ({
    icon,
    label,
    value,
    bgColor,
    textColor,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    bgColor: string;
    textColor: string;
}) => (
    <Card className="border shadow-sm">
        <CardContent className={`flex items-center space-x-4 p-6 ${bgColor}`}>
            <div className="p-3 rounded-full bg-white shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default BetStatisticsCards;


