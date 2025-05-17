import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetCompanyProfitLoss } from "@/react-query/payment-queries";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    Briefcase,
    Coins,
    IndianRupee,
    TrendingUp
} from "lucide-react";
import { useMemo } from "react";

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
        grossProfit,
        netProfitOrLoss,
        totalStockBets,
        totalStockWinnings,
        totalCasinoBets,
        totalCasinoWinnings,
    } = useMemo(() => {
        const result = data?.data?.result?.totalProfitAndLoss || {};
        return {
            totalDeposits: result.totalDeposits || 0,
            totalBonus: result.totalBonus || 0,
            totalBets: result.totalBets || 0,
            totalWinnings: result.totalWinnings || 0,
            totalWithdrawals: result.totalWithdrawals || 0,
            grossRevenue: result.grossRevenue || 0,
            grossProfit: result.grossProfit || 0,
            netProfitOrLoss: result.netProfitOrLoss || 0,
            totalStockBets: result.totalStockBets || 0,
            totalStockWinnings: result.totalStockWinnings || 0,
            totalCasinoBets: result.totalCasinoBets || 0,
            totalCasinoWinnings: result.totalCasinoWinnings || 0,
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

                    {/* Net Profit or Loss */}
                    <div className={cn("flex items-center space-x-3 p-4 col-span-2 rounded-md shadow-sm", netProfitOrLoss > 0 ? "border-green-600 border-2 bg-gradient-to-b from-green-50 to-green-300" : "border-red-600 border-2 bg-gradient-to-b from-red-50 to-red-300")}>
                        <ArrowUpCircle className={`w-8 h-8 ${netProfitOrLoss >= 0 ? "text-green-600" : "text-red-600 rotate-180"}`} />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Net Profit/Loss</p>
                            <p className="text-sm text-gray-500">
                                (Gross Profit - Total Bonus)
                            </p>
                            <p className={`text-2xl font-bold ${netProfitOrLoss >= 0 ? "text-green-800" : "text-red-800"}`}>
                                ₹{netProfitOrLoss.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-md shadow-sm">
                        <IndianRupee className="text-green-600 w-8 h-8" />
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
                            <p className="text-lg font-semibold text-gray-700">Total Bets(Stock + Casino)</p>
                            <p className="text-sm text-gray-500">Total amount wagered by users</p>
                            <p className="text-2xl font-bold text-blue-800">₹{totalBets.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Winnings */}
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-md shadow-sm">
                        <Banknote className="text-purple-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Winnings(Stock + Casino)</p>
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



                    {/* Gross Profit */}
                    <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-md shadow-sm">
                        <TrendingUp className="text-teal-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Gross Profit</p>
                            <p className="text-sm text-gray-500">
                                (Total Bets - Total Winnings)
                            </p>
                            <p className="text-2xl font-bold text-teal-800">₹{grossProfit.toLocaleString()}</p>
                        </div>
                    </div>


                    {/* Total Stock Bets */}
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-md shadow-sm">
                        <Briefcase className="text-green-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Stock Bets</p>
                            <p className="text-sm text-gray-500">Total stock bets placed</p>
                            <p className="text-2xl font-bold text-green-800">₹{totalStockBets.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Stock Winnings */}
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-md shadow-sm">
                        <Banknote className="text-purple-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Stock Winnings</p>
                            <p className="text-sm text-gray-500">Total stock winnings</p>
                            <p className="text-2xl font-bold text-purple-800">₹{totalStockWinnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Casino Bets */}
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-md shadow-sm">
                        <Briefcase className="text-blue-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Casino Bets</p>
                            <p className="text-sm text-gray-500">Total casino bets placed</p>
                            <p className="text-2xl font-bold text-blue-800">₹{totalCasinoBets.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Casino Winnings */}
                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-md shadow-sm">
                        <Banknote className="text-red-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Casino Winnings</p>
                            <p className="text-sm text-gray-500">Total casino winnings</p>
                            <p className="text-2xl font-bold text-red-800">₹{totalCasinoWinnings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyEarningsCard;
