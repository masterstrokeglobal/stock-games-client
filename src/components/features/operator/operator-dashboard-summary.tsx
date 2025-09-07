"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INR } from "@/lib/utils";
import { Wallet, Coins, TrendingUp, PiggyBank } from "lucide-react";

type OperatorWallet = {
    balance?: number;
};

type OperatorSummaryStats = {
    totalPlaced?: number;
    grossPayout?: number;
    netProfit?: number; // net P/L
};

type OperatorSummaryProps = {
    stats?: OperatorSummaryStats;
    wallet?: OperatorWallet | null;
};

const SummaryCard = ({ title, value, icon: Icon, valueClassName }: { title: string; value: string; icon: any; valueClassName?: string }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${valueClassName ?? ""}`}>{value}</div>
        </CardContent>
    </Card>
);

const OperatorDashboardSummary = ({ stats, wallet }: OperatorSummaryProps) => {
    const placed = INR(stats?.totalPlaced ?? 0);
    const gross = INR(stats?.grossPayout ?? 0);
    const net = stats?.netProfit ?? 0;
    const netStr = `${net < 0 ? "-" : ""}${INR(Math.abs(net))}`;
    const netClass = net < 0 ? "text-red-600" : net > 0 ? "text-green-600" : "";
    const balance = INR(wallet?.balance ?? 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Placed" value={placed} icon={Coins} />
            <SummaryCard title="Gross Payout" value={gross} icon={PiggyBank} />
            <SummaryCard title="Net P/L" value={netStr} icon={TrendingUp} valueClassName={netClass} />
            <SummaryCard title="Wallet Balance" value={balance} icon={Wallet} />
        </div>
    );
};

export default OperatorDashboardSummary;


