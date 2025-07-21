import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/context/auth-context";
import cryptoWalletAPI from "@/lib/axios/crypto-wallet-API";
import User from "@/models/user";
import { useGetMyCompany } from '@/react-query/company-queries';
import { Copy, Loader2 } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AmountInput } from "./funds-transfer";

// Deposit Methods Component
interface DepositMethodsProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const DepositMethods = ({ selectedMethod, onMethodChange }: DepositMethodsProps) => {
    const methods = [
        { id: 'upi', label: 'UPI', icon: <img src="/images/platform/wallet/upi.png" className="w-auto h-10" alt="upi" /> },
    ];
    const { data: company } = useGetMyCompany();
    const isCryptoPayIn = company?.cryptoPayIn;
    if (isCryptoPayIn) {
        methods.push({ id: 'crypto', label: 'Crypto', icon: <img src="/images/platform/wallet/crypto.png" className="w-auto h-10" alt="crypto" /> });
    }
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-platform-text text-base font-medium mb-2">Select Deposit Method</h3>
                <p className="text-platform-text text-sm mb-4">Each Option May Have Different Processing Times And Limits.</p>
            </div>
            <div className="flex flex-wrap gap-3">
                {methods.map((method) => (
                    <PaymentMethod
                        key={method.id}
                        icon={method.icon}
                        label={method.label ?? ""}
                        isSelected={selectedMethod === method.id}
                        onClick={() => onMethodChange(method.id)}
                    />
                ))}
            </div>
        </div>
    );
};

// Payment Method Component
interface PaymentMethodProps {
    icon: ReactNode;
    label?: string;
    isSelected: boolean;
    onClick: () => void;
}

const PaymentMethod = ({ icon, isSelected, onClick, label }: PaymentMethodProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center flex-1 justify-center gap-2 rounded-sm px-4 py-3 border-2 transition-all ${isSelected
                ? 'dark:border-[#3B4BFF] border-primary-game bg-[#3B4BFF]/20 text-white'
                : 'dark:border-platform-border border-primary-game bg-transparent text-white/80 hover:border-[#3B4BFF]/50'
                }`}
        >
            {icon}
            <span className="text-platform-text text-sm">{label}</span>
        </button>
    );
};

import { useCreateDepositRequest } from "@/react-query/payment-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const upiDepositSchema = (t: any) => z.object({
    pgId: z
        .string()
        .min(0, t('validation.transaction-id-required'))
        .max(50, t('validation.transaction-id-max')).optional(),
    amount: z
        .coerce.number({
            message: t('validation.amount-invalid')
        })
        .min(1, t('validation.amount-required'))
});

type UpiDepositFormValues = z.infer<ReturnType<typeof upiDepositSchema>>;
// Crypto Deposit Form Schema
const cryptoDepositSchema = z.object({
    crypto: z.string().min(1, "Select a cryptocurrency"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Enter a valid amount",
        }),
});

const UPIDepositForm = () => {
    const t = useTranslations('deposit');
    const { mutate, isPending } = useCreateDepositRequest();
    const { userDetails } = useAuthStore();
    const paymentImage = userDetails?.company?.paymentImage;

    const onSubmit = async (data: UpiDepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        mutate(data, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                    toast.success('Deposit request created successfully');
                    // router.push('/game/platform/transaction-history');
                } else {
                    // router.push('/game/platform/transaction-history');
                }
                form.reset({amount: 0, pgId: ""});
            },
            onError: () => {
                console.log('Error creating deposit request');
            }
        });
    }
    const form = useForm<UpiDepositFormValues>({
        resolver: zodResolver(upiDepositSchema(t)),
        defaultValues: { amount: 10, pgId: "" },
    });
   

    return (
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log(err);
        })}>
            {paymentImage && (
                <div className="bg-white overflow-hidden rounded-lg w-fit mx-auto">
                    <img src={paymentImage} alt="QR Code" />
                </div>
            )}
            <AmountInput
                number
                value={form.watch("amount")?.toString() ?? ""}
                onChange={(val) => form.setValue("amount", val  as  unknown as number ?? 0)}
                placeholder="Enter the amount to deposit"
                error={form.formState.errors.amount?.message}
            />

            <AmountInput
                label="Transaction ID"
                value={form.watch("pgId") ?? ""}
                onChange={(val) => form.setValue("pgId", val)}
                placeholder="Enter the transaction id"
                error={form.formState.errors.pgId?.message}
            />
            <Button
                variant="platform-gradient-secondary"
                size="lg"
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
            >
                Deposit Now
            </Button>
        </form>
    );
};

const CryptoDepositForm = ({
    user,
    copyToClipboard,
}: {
    user: User;
    copyToClipboard: (text: string) => void;
}) => {
    const [rate, setRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    const form = useForm<z.infer<typeof cryptoDepositSchema>>({
        resolver: zodResolver(cryptoDepositSchema),
        defaultValues: { crypto: "", amount: "" },
    });

    const selectedCrypto = form.watch("crypto");

    useEffect(() => {
        const fetchRate = async () => {
            if (!selectedCrypto) return;
            setIsLoading(true);

            try {
                const response = await cryptoWalletAPI.getConversionRate(selectedCrypto);
                setRate(Number(response.data));

                const selectedAddress = user?.cryptoAddress?.find(
                    address => address.cryptoId.toString() === selectedCrypto
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

    const walletAddress = useMemo(() => {
        const wallet = user?.cryptoAddress?.find(
            address => address.cryptoId.toString() === selectedCrypto
        )?.paymentAddress;
        return wallet;
    }, [selectedCrypto, user?.cryptoAddress]);

    const onSubmit = (data: z.infer<typeof cryptoDepositSchema>) => {
        // Handle Crypto deposit submission
        // e.g., call API
        toast.success(`Depositing ${data.amount} via ${data.crypto}`);
    };

    return (
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <label className="text-sm font-medium text-platform-text">
                    Select Cryptocurrency
                </label>
                <Select
                    onValueChange={(value) => {
                        form.setValue("crypto", value);
                        setSelectedWallet(
                            user?.cryptoAddress?.find(
                                address => address.cryptoId.toString() === value
                            )?.paymentAddress || null
                        );
                    }}
                    value={form.watch("crypto")}
                >
                    <SelectTrigger className="w-full bg-primary-game border-platform-border focus:bg-primary-game/80  border focus:border-game-secondary text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 rounded-none">
                        <SelectValue placeholder="Select Crypto" />
                    </SelectTrigger>
                    <SelectContent className="bg-primary-game rounded-none z-[60] border-platform-border">
                        {/* <SelectItem value="all" className="text-white">All</SelectItem> */}
                        {user?.cryptoAddress?.map((address) => (
                            <SelectItem key={address.cryptoId} className="text-platform-text" value={address.cryptoId.toString()}>
                                {address.crypto} ({address.symbol})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.crypto && (
                    <p className="text-red-500 text-xs">{form.formState.errors.crypto.message}</p>
                )}
            </div>
            <AmountInput
                value={form.watch("amount")}
                onChange={(val) => form.setValue("amount", val)}
                placeholder="Enter the amount to deposit"
                error={form.formState.errors.amount?.message}
            />
            {isLoading ? (
                <div className="bg-white/10 p-8 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-platform-text animate-spin" />
                </div>
            ) : rate && (
                <div className=" py-6 rounded-lg space-y-4">
                    <div className="bg-primary-game/10 p-4 rounded-lg">
                        <p className="text-platform-text text-center text-lg font-medium">
                            1 Crypto = ₹{rate?.toFixed(2)}
                        </p>
                    </div>
                    {selectedWallet && (
                        <div className="space-y-2">
                            <p className="text-platform-text text-sm">
                                Wallet Address
                            </p>
                            <div className="bg-primary-game/5 p-3 rounded-lg flex items-center justify-between gap-2">
                                <p className="text-platform-text text-sm break-all">
                                    {walletAddress}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0"
                                    type="button"
                                    onClick={() => copyToClipboard(walletAddress || "")}
                                >
                                    <Copy className="h-4 w-4 text-platform-text" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <Button
                variant="platform-gradient-secondary"
                size="lg"
                type="submit"
                disabled={form.formState.isSubmitting}
            >
                Deposit Now
            </Button>
        </form>
    );
};

// Tab Content Components
const DepositTab = () => {
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const { userDetails } = useAuthStore();
    const user: User = userDetails as User;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Wallet address copied to clipboard");
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy wallet address");
        }
    };

    return (
        <div className="space-y-6">
            {selectedMethod === "upi" && (
                <UPIDepositForm />
            )}
            {selectedMethod === "crypto" && (
                <CryptoDepositForm user={user} copyToClipboard={copyToClipboard} />
            )}
            <DepositMethods
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
            />
        </div>
    );
};

export default DepositTab;