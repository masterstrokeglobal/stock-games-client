import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetCompanyProfitLoss } from "@/react-query/payment-queries";
import {
    DollarSign,
    TrendingUp,
    Briefcase,
    Coins,
    Banknote,
    PiggyBank,
    ArrowUpCircle,
    ArrowDownCircle
} from "lucide-react";
import React, { useMemo } from "react";

type Props = {
    companyId: string;
};

const CompanyEarningsCard = ({ companyId }: Props) => {
    const { data } = useGetCompanyProfitLoss(companyId);

    // Use useMemo to memoize data extraction for better performance
    const {
        totalDeposits,
        totalBonus,
        totalBets,
        totalWinnings,
        totalWithdrawals,
        grossRevenue,
        grossProfit,
        netProfitOrLoss
    } = useMemo(() => {
        const result = data?.data?.result?.totalProfitAndLoss || {};
        return {
            totalDeposits: result.totalDeposits || 0,
            totalBonus:result.totalBonus || 0,
            totalBets:result.totalBets || 0,
            totalWinnings:result.totalWinnings || 0,
            totalWithdrawals:result.totalWithdrawals || 0,
            grossRevenue:result.grossRevenue || 0,
            grossProfit:result.grossProfit || 0,
            netProfitOrLoss:result.netProfitOrLoss || 0
        };
    }, [data]);

    return (
        <Card className="border shadow-none bg-white">
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Company Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Deposits */}
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-md shadow-sm">
                        <DollarSign className="text-green-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Deposits</p>
                            <p className="text-sm text-gray-500">Total funds deposited by users</p>
                            <p className="text-2xl font-bold text-green-800">₹{totalDeposits.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Bonus */}
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-md shadow-sm">
                        <Coins className="text-yellow-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Bonus</p>
                            <p className="text-sm text-gray-500">Bonuses awarded to users</p>
                            <p className="text-2xl font-bold text-yellow-800">₹{totalBonus.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Bets */}
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-md shadow-sm">
                        <Briefcase className="text-blue-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Bets</p>
                            <p className="text-sm text-gray-500">Total amount wagered by users</p>
                            <p className="text-2xl font-bold text-blue-800">₹{totalBets.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Winnings */}
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-md shadow-sm">
                        <Banknote className="text-purple-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Winnings</p>
                            <p className="text-sm text-gray-500">Winnings paid out to users</p>
                            <p className="text-2xl font-bold text-purple-800">₹{totalWinnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Withdrawals */}
                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-md shadow-sm">
                        <ArrowDownCircle className="text-red-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Withdrawals</p>
                            <p className="text-sm text-gray-500">Funds withdrawn by users</p>
                            <p className="text-2xl font-bold text-red-800">₹{totalWithdrawals.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Gross Revenue */}
                    <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-md shadow-sm">
                        <PiggyBank className="text-orange-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Gross Revenue</p>
                            <p className="text-sm text-gray-500">Total revenue generated</p>
                            <p className="text-2xl font-bold text-orange-800">₹{grossRevenue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-md shadow-sm">
                        <TrendingUp className="text-teal-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Gross Profit</p>
                            <p className="text-sm text-gray-500">Revenue minus expenses</p>
                            <p className="text-2xl font-bold text-teal-800">₹{grossProfit.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Net Profit or Loss */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md shadow-sm">
                        <ArrowUpCircle className={`w-8 h-8 ${netProfitOrLoss >= 0 ? "text-green-600" : "text-red-600"}`} />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Net Profit/Loss</p>
                            <p className="text-sm text-gray-500">Final profit after all expenses</p>
                            <p className={`text-2xl font-bold ${netProfitOrLoss >= 0 ? "text-green-800" : "text-red-800"}`}>
                                ₹{netProfitOrLoss.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyEarningsCard;
