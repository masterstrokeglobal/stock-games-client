import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { useCompanyWalletByCompanyId, useCreateCompanyWallet } from "@/react-query/company-queries";
import { Loader2, WalletIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
    companyId: string;
}

const CompanyWalletCard = ({ companyId }: Props) => {
    const {
        data,
        isLoading,
        error
    } = useCompanyWalletByCompanyId({ companyId });

    const { userDetails } = useAuthStore();
    const admin = userDetails as Admin;

    const { mutate, isPending } = useCreateCompanyWallet();

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

    // Handle wallet creation
    const handleCreateWallet = () => mutate(companyId);

    // Loading state
    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <WalletIcon className="mr-2 h-5 w-5" />
                        Company Wallet
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
                        Company Wallet
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
                        {admin.isSuperAdmin && <Link href={`/dashboard/company/${companyId}/deposit`}>
                            <Button className="w-full">
                                Add Funds to wallet
                            </Button>
                        </Link>}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Wallet not found state
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <WalletIcon className="mr-2 h-5 w-5" />
                    Company Wallet
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <WalletIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Wallet Found</h3>
                    <p className="text-muted-foreground mb-4">
                     {`   This company doesn't have a wallet yet.`}
                    </p>
                    <Button
                        onClick={handleCreateWallet}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Wallet...
                            </>
                        ) : (
                            "Create Wallet"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyWalletCard;