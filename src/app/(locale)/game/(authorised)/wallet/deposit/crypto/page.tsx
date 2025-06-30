"use client";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import { useAuthStore } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import User from "@/models/user";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import cryptoWalletAPI from "@/lib/axios/crypto-wallet-API";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

// Zod schema for deposit form
const depositSchema = () => z.object({
    cryptoAddress: z.string().min(1, "Crypto address is required"),
});

export type DepositFormValues = z.infer<ReturnType<typeof depositSchema>>;

const DepositForm = () => {
    const [rate, setRate] = useState<number | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const user: User = useAuthStore().userDetails as User;
    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema()),
        defaultValues: {
            cryptoAddress: '',
        }
    });

    const { watch } = form;
    const selectedCrypto = watch('cryptoAddress');

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Wallet address copied to clipboard");
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy wallet address");
        }
    };

    useEffect(() => {
        const fetchRate = async () => {
            if (!selectedCrypto) return;
            setIsLoading(true);

            try {
                const response = await cryptoWalletAPI.getConversionRate(selectedCrypto);
                setRate(Number(response.data));
                
                const selectedAddress = user?.cryptoAddress?.find(
                    address => address.id.toString() === selectedCrypto
                );
                setSelectedWallet(selectedAddress?.paymentAddress || null);
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
                toast.error("Failed to fetch conversion rate");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();
    }, [selectedCrypto, user?.cryptoAddress]);

    return (
        <Container className="flex flex-col space-y-8 items-center bg-primary-game pt-24">
            <TopBar>
                Crypto Deposit
            </TopBar>

            <div className="w-full max-w-sm flex flex-col min-h-[calc(100svh-5rem)] p-4 rounded-lg">
                <header>
                    <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                        Crypto Deposit
                    </h2>
                    <p className="text-[#6A84C3] text-center text-sm">
                        Deposit funds using cryptocurrency
                    </p>
                </header>

                <FormProvider
                    methods={form}
                    onSubmit={() => {}}
                    className="space-y-4 flex-1 mt-8 flex flex-col"
                >
                    <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">
                                Select Cryptocurrency
                            </label>
                            <Select
                                onValueChange={(value) => form.setValue('cryptoAddress', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a cryptocurrency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {user?.cryptoAddress?.map((address) => (
                                        <SelectItem key={address.cryptoId} value={address.cryptoId.toString()}>
                                            {address.crypto} ({address.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoading ? (
                            <div className="bg-white/10 p-8 rounded-lg flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                            </div>
                        ) : rate && (
                            <div className="bg-white/10 p-6 rounded-lg space-y-4">
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-white text-center text-lg font-medium">
                                        1 Crypto = ₹{rate?.toFixed(2)}
                                    </p>
                                </div>
                                
                                {selectedWallet && (
                                    <div className="space-y-2">
                                        <p className="text-white/80 text-sm">
                                            Wallet Address
                                        </p>
                                        <div className="bg-white/5 p-3 rounded-lg flex items-center justify-between gap-2">
                                            <p className="text-white text-sm break-all">
                                                {selectedWallet}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => copyToClipboard(selectedWallet)}
                                            >
                                                <Copy className="h-4 w-4 text-white" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </FormProvider>
            </div>
        </Container>
    );
};

export default DepositForm;
