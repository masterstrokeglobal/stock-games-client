import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAgentWallet } from "@/react-query/agent-queries";
import { Loader2, WalletIcon } from "lucide-react";
import { useMemo } from "react";

type Props = {
    agentId: string;
}

const AgentWalletCard = ({ agentId }: Props) => {
    const {
        data,
        isLoading,
        error
    } = useGetAgentWallet(agentId);


    // Simplify wallet presence check
    const isWalletNotFound = useMemo(() =>
        error?.response?.status === 404,
        [error?.response?.status]
    );

    // Format wallet data for display
    const walletData = useMemo(() => ({
        balance: data?.balance?.toFixed(2) || "0.00",
        updatedAt: data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "-",
        id: data?.id || "-"
    }), [data]);


    // Loading state
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <WalletIcon className="mr-2 h-5 w-5" />
                        Agent Wallet
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading wallet information...</span>
                </CardContent>
            </Card>
        );
    }

    // Wallet exists state
    if (!isWalletNotFound) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <WalletIcon className="mr-2 h-5 w-5" />
                        Agent Wallet
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <div className="rounded-lg bg-muted p-4">
                            <div className="text-sm text-muted-foreground">Current Balance</div>
                            <div className="mt-1 text-2xl font-bold">
                                Rs.{walletData.balance}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <span>Last Updated</span>
                            <span className="text-right">{walletData.updatedAt}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Wallet not found state
    return (<h1>Wallet not found</h1>);

};

export default AgentWalletCard;