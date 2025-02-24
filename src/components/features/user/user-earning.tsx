"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Wallet from "@/models/wallet";
import { useGetUserProfitLoss } from "@/react-query/payment-queries"; // Adjust this hook to fetch user-specific data
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    Briefcase,
    Coins,
    DollarSign,
    HandCoins
} from "lucide-react";
import React, { useMemo } from "react";

type Props = {
    userId: string;
};

const UserEarningsCard = ({ userId }: Props) => {
    const { data } = useGetUserProfitLoss(userId); // Fetch user-specific profit/loss data

    // Extract and format data from the API response
    const {
        totalDeposits,
        totalBonus,
        totalBets,
        totalWinnings,
        totalWithdrawals,
        totalplatformfees,
        netProfitOrLoss,
        wallet,
    } = useMemo(() => {
        const result = data?.data?.result || {};
        return {
            totalDeposits: result.totaldeposits ?? 0,
            totalBonus: result.totalbonus ?? 0,
            totalBets: result.totalbets ?? 0,
            totalWinnings: result.totalwinnings ?? 0,
            totalplatformfees: result.totalplatformfees ?? 0,
            totalWithdrawals: result.totalwithdrawals ?? 0,
            netProfitOrLoss: result.netProfitOrLoss ?? 0,
            wallet: new Wallet(result.wallet),
        };
    }, [data]);

    return (
        <Card className="border shadow-none bg-white">
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">User Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Deposits */}
                    <StatCard
                        icon={<DollarSign className="text-green-600 w-8 h-8" />}
                        label="Total Deposits"
                        value={totalDeposits}
                        color="green"
                    />

                    {/* Total Bonus */}
                    <StatCard
                        icon={<Coins className="text-yellow-600 w-8 h-8" />}
                        label="Total Bonus"
                        value={totalBonus}
                        color="yellow"
                    />

                    {/* Total Bets */}
                    <StatCard
                        icon={<Briefcase className="text-blue-600 w-8 h-8" />}
                        label="Total Bets"
                        value={totalBets}
                        color="blue"
                    />

                    {/* Total Winnings */}
                    <StatCard
                        icon={<Banknote className="text-purple-600 w-8 h-8" />}
                        label="Total Winnings"
                        value={totalWinnings}
                        color="purple"
                    />

                    {/* Total Withdrawals */}
                    <StatCard
                        icon={<ArrowDownCircle className="text-red-600 w-8 h-8" />}
                        label="Total Withdrawals"
                        value={totalWithdrawals}
                        color="red"
                    />
            

                    {/* Net Profit or Loss */}


                    <StatCard
                        icon={<DollarSign className="text-green-600 w-8 h-8" />}
                        label="Main Balance"
                        value={wallet?.mainBalance ?? 0}
                        color="green"
                    />

                    <StatCard
                        icon={<Banknote className="text-blue-600 w-8 h-8" />}
                        label="Bonus Balance"
                        value={wallet?.bonusBalance ?? 0}
                        color="blue"
                    />

                    <StatCard
                        icon={<Briefcase className="text-yellow-600 w-8 h-8" />}
                        label="Total Balance"
                        value={wallet?.totalBalance ?? 0}
                        color="yellow"
                    />


                    <StatCard
                        icon={
                            <ArrowUpCircle
                                className={`w-8 h-8 ${netProfitOrLoss >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            />
                        }
                        label="Net Profit/Loss"
                        value={netProfitOrLoss}
                        color={netProfitOrLoss >= 0 ? "green" : "red"}
                    />

                </div>
            </CardContent>
        </Card>
    );
};

// Reusable Stat Card component
export const StatCard = ({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
}) => (
    <div className={`flex items-center space-x-3 p-4 bg-${color}-50 rounded-md shadow-sm`}>
        {icon}
        <div>
            <p className="text-lg font-semibold text-gray-700">{label}</p>
            <p className={`text-2xl font-bold text-${color}-800`}>₹{value.toLocaleString()}</p>
        </div>
    </div>
);

export default UserEarningsCard;
