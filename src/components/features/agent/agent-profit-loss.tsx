import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    Briefcase,
    Coins,
    DollarSign
} from "lucide-react";
import { PLATFORMFEES } from '@/lib/utils';

type Props = {
    data: {
        totalProfitAndLoss: {
            totalDeposits: number;
            totalBonus: number;
            totalBets: number;
            totalWinnings: number;
            totalWithdrawals: number;
            totalMainBalance: number;
            totalBonusBalance: number;
            totalBalance: number;
            netProfitOrLoss: number;
        }
    };
};

const AgentProfitLossCard = ({ data }: Props) => {
    // Extract and format data from the input
    const {
        totalDeposits,
        totalBonus,
        totalBets,
        totalBalance,
        totalBonusBalance,
        WithdrawalableAmount,
        totalMainBalance,
        totalWinnings,
        totalWithdrawals,
        netProfitOrLoss,
    } = useMemo(() => {
        const result = data?.totalProfitAndLoss || {};

        const totalAmount = result.totalMainBalance + result.totalBonusBalance;
        const WithdrawalableAmount = result.totalMainBalance - (result.totalMainBalance * PLATFORMFEES / 100);
        return {
            totalDeposits: result.totalDeposits ?? 0,
            totalBonus: result.totalBonus ?? 0,
            totalBets: result.totalBets ?? 0,
            totalWinnings: result.totalWinnings ?? 0,
            totalWithdrawals: result.totalWithdrawals ?? 0,
            totalMainBalance: result.totalMainBalance ?? 0,
            totalBonusBalance: result.totalBonusBalance ?? 0,
            totalBalance: totalAmount,
            WithdrawalableAmount: WithdrawalableAmount,
            netProfitOrLoss: result.netProfitOrLoss ?? 0,
        };
    }, [data]);

    return (
        <Card className="border shadow-none bg-white">
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Agent Financial Overview</CardTitle>
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

                    {/* Total Main Balance */}
                    <StatCard
                        icon={<DollarSign className="text-green-600 w-8 h-8" />}
                        label="Total Main Balance"
                        value={totalMainBalance}
                        color="green"
                    />

                    {/* Total Bonus Balance */}
                    <StatCard
                        icon={<Coins className="text-yellow-600 w-8 h-8" />}
                        label="Total Bonus Balance"
                        value={totalBonusBalance}
                        color="yellow"
                    />

                    {/* Total Balance */}
                    <StatCard
                        icon={<Coins className="text-blue-600 w-8 h-8" />}
                        label="Total Balance"
                        value={totalBalance}
                        color="blue"
                    />

                    {/* Withdrawable Amount */}
                    <StatCard
                        icon={<Coins className="text-green-600 w-8 h-8" />}
                        label="Withdrawable Amount"
                        value={WithdrawalableAmount}
                        color="green"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

// Reusable Stat Card component
const StatCard = ({
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

export default AgentProfitLossCard;