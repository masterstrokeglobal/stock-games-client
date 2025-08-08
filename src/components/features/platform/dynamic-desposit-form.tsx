import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import { CompanyQRType } from "@/models/company-qr";
import { useGetActiveCompanyQR } from '@/react-query/company-qr-queries';
import { useCreateDepositRequest } from "@/react-query/payment-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Copy, Loader2, RefreshCcw, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AmountInput } from "./funds-transfer";

// Deposit Methods Component
interface DepositMethodsProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

const DepositMethods = ({ selectedMethod, onMethodChange }: DepositMethodsProps) => {
    const methods = [
        { id: 'upi', label: 'UPI', icon: <Smartphone className="w-6 h-6" /> },
        { id: 'bank', label: 'Bank Transfer', icon: <Building2 className="w-6 h-6" /> },
    ];

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

// Form Schema
const depositSchema = (t: any) => z.object({
    pgId: z
        .string()
        .min(1, t('validation.transaction-id-required'))
        .max(50, t('validation.transaction-id-max')),
    amount: z
        .coerce.number({
            message: t('validation.amount-invalid')
        })
        .min(1, t('validation.amount-required'))
});

type DepositFormValues = z.infer<ReturnType<typeof depositSchema>>;

// UPI Deposit Form
const UPIDepositForm = () => {
    const t = useTranslations('deposit');
    const { mutate, isPending } = useCreateDepositRequest();
    const { data: companyQR, isFetching: isLoading, refetch } = useGetActiveCompanyQR({ type: CompanyQRType.UPI });

    const onSubmit = async (data: DepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        mutate({
            amount: data.amount,
            pgId: data.pgId,
            companyQrId: companyQR?.id,
        }, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                }
                form.reset({ amount: 0, pgId: "" });
            },
            onError: () => {
                toast.error('Error creating deposit request');
            }
        });
    }

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema(t)),
        defaultValues: { amount: 10, pgId: "" },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-platform-text" />
            </div>
        );
    }

    if (companyQR == null && !isLoading) {
        return (
            <div className="border space-y-4 p-4 text-center">
                <h2 className="text-platform-text font-semibold">No Payment Method Available</h2>
                <p className="text-platform-text/80 text-sm">Please choose another payment method or contact support for assistance.</p>
            </div>
        );
    }

    return (
        <div>
            <FormProvider methods={form} className="space-y-4" onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.log(err);
            })}>
                {companyQR?.qr && (
                    <div className="bg-white overflow-hidden rounded-lg w-fit mx-auto max-w-sm p-4">
                        <img src={companyQR.qr} alt="UPI QR Code" className="max-w-full w-full aspect-square h-auto" />
                    </div>
                )}


                <AmountInput
                    number
                    value={form.watch("amount")?.toString() ?? ""}
                    onChange={(val) => form.setValue("amount", val as unknown as number ?? 0)}
                    placeholder="Enter the amount to deposit"
                    error={form.formState.errors.amount?.message}
                />

                <AmountInput
                    label="Transaction ID"
                    value={form.watch("pgId") ?? ""}
                    onChange={(val) => form.setValue("pgId", val)}
                    placeholder="Enter the transaction ID"
                    error={form.formState.errors.pgId?.message}
                />

                <Button
                    variant="platform-gradient-secondary"
                    size="lg"
                    type="submit"
                    disabled={form.formState.isSubmitting || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Deposit Now'
                    )}
                </Button>
            </FormProvider>
            <Button variant="platform-outline" className="mt-4 w-full !rounded-md border-2" disabled={isLoading} onClick={() => refetch()} >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Change QR
                    </>
                )}
            </Button>
        </div>
    );
};

// Bank Transfer Deposit Form
const BankDepositForm = () => {
    const t = useTranslations('deposit');
    const { mutate, isPending } = useCreateDepositRequest();
    const { data: companyQR, isFetching: isLoading, refetch } = useGetActiveCompanyQR({ type: CompanyQRType.BANK });

    const onSubmit = async (data: DepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        mutate({
            companyQrId: companyQR?.id,
            pgId: data.pgId,
            amount: data.amount ?? 0
        }, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                }
                form.reset({ amount: 0, pgId: "" });
            },
            onError: () => {
                toast.error('Error creating deposit request');
            }
        });
    }

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema(t)),
        defaultValues: { amount: 10, pgId: "" },
    });

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-platform-text" />
            </div>
        );
    }

    if (companyQR == null && !isLoading) {
        return (
            <div className="border space-y-4 p-4 text-center">
                <h2 className="text-platform-text font-semibold">No Payment Method Available</h2>
                <p className="text-platform-text/80 text-sm">Please choose another payment method or contact support for assistance.</p>
            </div>
        );
    }
    return (
        <div>

            <FormProvider methods={form} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {companyQR && (
                    <div className="space-y-4">
                        {/* Bank Details Card */}
                        <div className="bg-primary-game/10 p-4 rounded-md border-2 border-primary-game">
                            <h4 className="text-platform-text font-medium mb-3">Bank Transfer Details</h4>
                            <div className="space-y-3">
                                {companyQR.bankName && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-platform-text/80 text-sm">Bank Name:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-platform-text font-medium">{companyQR.bankName}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                type="button"
                                                onClick={() => copyToClipboard(companyQR.bankName || "")}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {companyQR.accountNumber && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-platform-text/80 text-sm">Account Number:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-platform-text font-medium font-mono">
                                                {companyQR.accountNumber}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                type="button"
                                                onClick={() => copyToClipboard(companyQR.accountNumber || "")}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {companyQR.ifscCode && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-platform-text/80 text-sm">IFSC Code:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-platform-text font-medium font-mono">
                                                {companyQR.ifscCode}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                type="button"
                                                onClick={() => copyToClipboard(companyQR.ifscCode || "")}
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                <AmountInput
                    number
                    value={form.watch("amount")?.toString() ?? ""}
                    onChange={(val) => form.setValue("amount", val as unknown as number ?? 0)}
                    placeholder="Enter the amount to deposit"
                    error={form.formState.errors.amount?.message}
                />

                <AmountInput
                    label="Transaction ID"
                    value={form.watch("pgId") ?? ""}
                    onChange={(val) => form.setValue("pgId", val)}
                    placeholder="Enter the transaction ID from your bank transfer"
                    error={form.formState.errors.pgId?.message}
                />

                <Button
                    variant="platform-gradient-secondary"
                    size="lg"
                    type="submit"
                    disabled={form.formState.isSubmitting || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Submit Deposit'
                    )}
                </Button>
            </FormProvider>
            <Button variant="platform-outline" className="mt-4 w-full !rounded-md border-2" disabled={isLoading} onClick={() => refetch()} >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Change QR
                    </>
                )}
            </Button>
        </div>
    );
};



// Main Deposit Tab Component
const DepositTab = () => {
    const [selectedMethod, setSelectedMethod] = useState("upi");

    return (
        <div className="space-y-6">
            <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 px-4 py-2 text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                <span className="block font-semibold">Deposit Processing Time</span>
                <span className="block text-sm mt-1">
                    Deposits are typically processed within <span className="font-semibold">5 to 15 minutes</span>. Please wait for confirmation before contacting support.
                </span>
            </div>

            <DepositMethods
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
            />

            {selectedMethod === "upi" && <UPIDepositForm />}
            {selectedMethod === "bank" && <BankDepositForm />}
        </div>
    );
};

export default DepositTab;