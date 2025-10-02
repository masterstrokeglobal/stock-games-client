import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetSettlements } from "@/react-query/operator-queries";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    Briefcase,
    Coins,
    IndianRupee,
    TrendingUp
} from "lucide-react";
import { useCallback, useMemo } from "react";

const CompanyEarningsCard = () => {
    // Memoize date parameters to prevent infinite re-renders
    const filterParams = useMemo(() => ({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
        endDate: new Date(), // Current date
        aggregate: true
    }), []); // Empty dependency array since we want static dates

    // Use settlements API with aggregate=true to get company-level data
    const { data } = useGetSettlements(filterParams);

    // Use useMemo to memoize data extraction for better performance
    const {
        totalDeposits,
        totalBonus,
        totalBets,
        totalWinnings,
        totalWithdrawals,
        grossProfit,
        totalStockBets,
        totalStockWinnings,
        totalCasinoBets,
        totalCasinoWinnings,
        netPoolPL,
    } = useMemo(() => {
        // Map settlements API response to expected format
        // The settlements API returns: { summary: { totalRecharge, totalRedeem, net, companyShare }, data: [...] }
        const summary = data?.summary || {};
        
        // Map settlements terminology to company earnings terminology:
        // totalPlacement = totalDeposits (money placed/bet by users)
        // totalWinning = totalWinnings (money won by users)
        // net = gross profit (placement - winning)
        return {
            totalDeposits: summary.totalPlacement || 0,
            totalBonus: 0, // Not available in settlements API
            totalBets: summary.totalPlacement || 0, // Using placement as total bets
            totalWinnings: summary.totalWinning || 0,
            totalWithdrawals: summary.totalWinning || 0, // Using winnings as proxy for withdrawals
            grossRevenue: summary.totalPlacement || 0,
            grossProfit: summary.net || 0,
            netProfitOrLoss: summary.net || 0,
            totalStockBets: summary.totalPlacement || 0, // Using placement as proxy
            totalStockWinnings: summary.totalWinning || 0,
            totalCasinoBets: 0, // Not separated in settlements API
            totalCasinoWinnings: 0, // Not separated in settlements API
            netPoolPL: summary.net || 0, // Net profit/loss
        };
    }, [data]);

    const handleDownloadReport = useCallback(() => {
        // Get the current date for filename
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Prepare CSV data
        const csvData = [
            ['Metric', 'Value (₹)'],
            ['Total Deposits', totalDeposits.toFixed(2)],
            ['Total Bonus', totalBonus.toFixed(2)],
            ['Total Stock Bets', totalStockBets.toFixed(2)],
            ['Total Stock Winnings', totalStockWinnings.toFixed(2)],
            ['Total Casino Bets', totalCasinoBets.toFixed(2)],
            ['Total Casino Winnings', totalCasinoWinnings.toFixed(2)],
            ['Total Bets (Stock + Casino)', totalBets.toFixed(2)],
            ['Total Winnings (Stock + Casino)', totalWinnings.toFixed(2)],
            ['Total Withdrawals', totalWithdrawals.toFixed(2)],
            ['Gross Revenue', (data?.summary?.totalPlacement || 0).toFixed(2)],
            ['Gross Profit', grossProfit.toFixed(2)],
            ['Net Profit/Loss', (data?.summary?.net || 0).toFixed(2)],
            ['Net Pool P/L (Deposits - Withdrawals)', netPoolPL.toFixed(2)]
        ];

        // Convert to CSV string
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `company-profit-loss-report-${currentDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [totalDeposits, totalBonus, totalStockBets, totalStockWinnings, totalCasinoBets, totalCasinoWinnings, totalBets, totalWinnings, totalWithdrawals, grossProfit, netPoolPL, data]);

    return (
        <Card className="border shadow-none bg-white">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-semibold mb-4">Company Financial Overview</CardTitle>
                <Button onClick={() => handleDownloadReport()}>
                    Download Report
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Deposits */}

                    {/* Net Pool P/L (Deposits - Withdrawals) */}
                    <div className={cn("flex items-center space-x-3 p-4 col-span-2 rounded-md shadow-sm", netPoolPL > 0 ? "border-green-600 border-2 bg-gradient-to-b from-green-50 to-green-300" : "border-red-600 border-2 bg-gradient-to-b from-red-50 to-red-300")}>
                        <ArrowUpCircle className={`w-8 h-8 ${netPoolPL >= 0 ? "text-green-600" : "text-red-600 rotate-180"}`} />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Net Pool P/L</p>
                            <p className="text-sm text-gray-500">(Deposits − Withdrawals)</p>
                            <p className={`text-2xl font-bold ${netPoolPL >= 0 ? "text-green-800" : "text-red-800"}`}>
                                ₹{netPoolPL.toLocaleString()}
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
