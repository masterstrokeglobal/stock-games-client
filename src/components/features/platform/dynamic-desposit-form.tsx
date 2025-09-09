import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import { CompanyQRType } from "@/models/company-qr";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import { useGetActiveCompanyQR } from '@/react-query/company-qr-queries';
import { useCreateDepositRequest } from "@/react-query/payment-queries";
import { useGetAllWithdrawDetails } from "@/react-query/withdrawl-details-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Copy, Loader2, RefreshCcw, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AmountInput } from "./funds-transfer";
import FormImage from "@/components/ui/form/form-image-compact";
import { cn } from "@/lib/utils";
import { useGetMyCompany } from "@/react-query/company-queries";
import { CryptoDepositForm } from "./deposit-form";
import { BankIcon } from "../user-menu/icons";
import { PaymentMethod } from "@/models/transaction";
import PaymentMethodDialog from "./payment-method-dialog";

// Deposit Methods Component
interface DepositMethodsProps {
    selectedMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
}

const DepositMethods = ({ selectedMethod, onMethodChange }: DepositMethodsProps) => {
    const methods = [
        { id: PaymentMethod.UPI, label: 'UPI', icon: <Smartphone className="w-6 h-6" />, img:'/images/payment-methods/upi.png' },
    ];

    const bankMethods = [
        { id: PaymentMethod.RTGS, label: 'RTGS', icon: <BankIcon className="w-6 h-6" />, img:'/images/payment-methods/bank-transfer.png' },
        { id: PaymentMethod.NEFT, label: 'NEFT', icon: <Building2 className="w-6 h-6" />, img:'/images/payment-methods/bank-transfer.png' }
    ]

    const { data: company } = useGetMyCompany();
    const isCryptoPayIn = company?.cryptoPayIn;

    if(company?.dynamicQR) {
        methods.push({ id: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer', icon: <BankIcon className="w-6 h-6" />, img:'/images/payment-methods/bank-transfer.png' });
    }

    if (isCryptoPayIn) {
        methods.push({ id: PaymentMethod.CRYPTO, label: 'Crypto', icon: <img src="/images/platform/wallet/crypto.png" className="w-auto h-10" alt="crypto" />, img:'/images/payment-methods/crypto.png' });
    }

    
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-platform-text md:text-base text-[15px] text-center font-medium mb-2">Select Payment Method</h3>
                <p className="text-platform-text text-[10px] md:text-xs text-center mb-4">Each Option May Have Different Processing Times And Limits.</p>
            </div>
            <div className={`gap-3 grid ${methods.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {methods.map((method) => (
                    <PaymentMethodButton
                        key={method.id}
                        img={method.img}
                        label={method.label ?? ""}
                        isSelected={selectedMethod === method.id}
                        onClick={() => onMethodChange(method.id)}
                        bankTransfer={false}
                    />
                ))}
            </div>

            {[PaymentMethod.BANK_TRANSFER, PaymentMethod.NEFT, PaymentMethod.RTGS].includes(selectedMethod) && (
                <div className="grid grid-cols-2 gap-3">
                    {bankMethods.map((method) => (
                        <PaymentMethodButton
                            key={method.id}
                            img={method.img}
                            label={method.label ?? ""}
                            isSelected={selectedMethod === method.id}
                            onClick={() => onMethodChange(method.id)}
                            bankTransfer={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Payment Method Component
interface PaymentMethodButtonProps {
    label?: string;
    isSelected: boolean;
    onClick: () => void;
    img: string;
    bankTransfer?: boolean;
}

const PaymentMethodButton = ({ isSelected, onClick, label, img, bankTransfer }: PaymentMethodButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center flex-1 justify-center gap-2 rounded-sm px-4 py-1 border-2 transition-all ${isSelected ? 'dark:border-[#3B4BFF] border-primary-game bg-[#3B4BFF]/20 text-white' : 'dark:border-platform-border border-primary-game bg-transparent text-white/80 hover:border-[#3B4BFF]/50'}`}
        >
           {bankTransfer ? label : <img src={img} alt={label} className="h-7 md:h-9" />}
        </button>
    );
};

// Withdrawal Method Option Component (reused from withdraw form)
interface WithdrawMethodOptionProps {
    detail: WithdrawDetailsRecord;
    selected: boolean;
    onClick: () => void;
    t: (key: string) => string;
}

const WithdrawMethodOption: React.FC<WithdrawMethodOptionProps> = ({
    detail,
    selected,
    onClick,
    t,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            data-state={selected ? "active" : "inactive"}
            className={cn(
                "flex items-center gap-3 px-4 py-3 border-2 rounded-md transition-all w-full",
                "bg-gradient-to-r from-transparent to-transparent",
                "dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] from-primary-game to-primary-game data-[state=active]:text-white data-[state=active]:border-l-2 data-[state=active]:border-[#3B4BFF] border-l-2 border-transparent",
                "border-platform-border text-white/80 hover:border-[#3B4BFF]/50"
            )}
        >
            <div className={cn(
                "w-3 h-3 rounded-full",
                selected ? " bg-platform-text" : "dark:border-platform-border border-primary-game"
            )} />
            <div className="flex-1 text-left">
                <p className="text-platform-text font-medium">{detail.accountName || detail.upiId}</p>
                <p className="text-platform-text text-sm">
                    {detail.isUpi ? detail.upiId :
                        `${detail.ifscCode} • ****${detail.accountNumber?.slice(-4)}`}
                </p>
            </div>
            <div className="text-xs px-2 py-1 rounded-full dark:bg-[#2A3655] bg-primary-game text-platform-text">
                {detail.isUpi ? t('upi') : t('bank')}
            </div>
        </button>
    );
};

// Form Schema
const depositSchema = (t: any, askWithdrawlOption?: boolean) => z.object({
    pgId: z
        .string()
        .optional(),
    confirmationImageUrl: z
        .string()
        .url(t('validation.confirmation-image-url-invalid'))
        .or(z.literal(""))
        .or(z.undefined()),
    amount: z
        .coerce.number({
            message: t('validation.amount-invalid')
        })
        .min(100, t('validation.amount-required-100')),
    withdrawlDetailsId: askWithdrawlOption
        ? z.string().min(1, 'deposit method is required')
        : z.string().optional(),
}).superRefine((data, ctx) => {
    const hasPgId = !!data.pgId && data.pgId.toString().trim() !== "";
    const hasImage = !!data.confirmationImageUrl && data.confirmationImageUrl.toString().trim() !== "";
    if (hasPgId === hasImage) {
        const message = "Provide exactly one: Transaction ID or Confirmation Image.";
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["pgId"] });
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["confirmationImageUrl"] });
    }
});

type DepositFormValues = z.infer<ReturnType<typeof depositSchema>>;

// UPI Deposit Form
const UPIDepositForm = () => {
    const t = useTranslations('deposit');
    const tWithdraw = useTranslations('withdraw');
    const { mutate, isPending } = useCreateDepositRequest();
    const { data: companyQR, isFetching: isLoading, refetch } = useGetActiveCompanyQR({ type: CompanyQRType.UPI });
    const { data: withdrawDetailsData, isLoading: isLoadingWithdrawDetails, refetch: refetchWithdrawDetails } = useGetAllWithdrawDetails({});
    const { data: company } = useGetMyCompany();
    const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);

    const withdrawDetails = useMemo(() => {
        if (withdrawDetailsData?.data) {
            return withdrawDetailsData.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [withdrawDetailsData]);

    const activeWithdrawDetails = withdrawDetails.filter(
        (detail: { deletedAt: any }) => !detail.deletedAt
    );

    const onSubmit = async (data: DepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        const payload: any = {
            amount: data.amount,
            pgId: data.pgId,
            companyQrId: companyQR?.id,
            confirmationImageUrl: data.confirmationImageUrl,
            paymentMethod: PaymentMethod.UPI,
            withdrawlDetailsId: data.withdrawlDetailsId,
        }
        if (company?.askWithdrawlOption && data.withdrawlDetailsId) {
            payload.withdrawlDetailsId = data.withdrawlDetailsId;
        }
        mutate(payload, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                }
                form.reset({ amount: 100, pgId: "", confirmationImageUrl: "", withdrawlDetailsId: "" });
            },
            onError: () => {
                toast.error('Error creating deposit request');
            }
        })
    }

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema(t, company?.askWithdrawlOption)),
        defaultValues: { amount: 100, pgId: "", confirmationImageUrl: "", withdrawlDetailsId: "" },
    });

    if (isLoading || isLoadingWithdrawDetails) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-platform-text" />
            </div>
        );
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy");
        }
    };

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
                    <>
                        <div className="bg-white overflow-hidden rounded-lg w-fit mx-auto max-w-sm p-4">
                            <img src={companyQR.qr} alt="UPI QR Code" className="max-w-full w-full aspect-square h-auto" />
                        </div>
                        {companyQR.upiId && (
                            <div className="flex items-center justify-between">
                                <span className="text-platform-text/80 text-sm">UPI ID:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-platform-text font-medium">{companyQR.upiId}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        type="button"
                                        onClick={() => copyToClipboard(companyQR.upiId || "")}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
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
                    required={false}
                />
                {company?.askWithdrawlOption && (
                    <div className="space-y-2">
                        <div>
                            <span className="text-platform-text text-base font-medium">
                                Add Withdrawal Method
                            </span>
                        </div>
                        <Controller
                            control={form.control}
                            name="withdrawlDetailsId"
                            render={({ field }) => (
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    {activeWithdrawDetails.length === 0 ? (
                                        <>
                                            <p className="text-platform-text text-sm py-4 text-center">
                                                {tWithdraw('no-methods-found')}
                                            </p>
                                            <Button
                                                variant="platform-outline"
                                                size="lg"
                                                className="w-full"
                                                type="button"
                                                onClick={() => setShowPaymentMethodDialog(true)}
                                            >
                                                Add New Method
                                            </Button>
                                        </>
                                    ) : (
                                        activeWithdrawDetails.map((detail: WithdrawDetailsRecord) => (
                                            <WithdrawMethodOption
                                                key={detail.id}
                                                detail={detail}
                                                selected={field.value === detail.id?.toString()}
                                                onClick={() => field.onChange(detail.id?.toString())}
                                                t={tWithdraw}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                        />
                        {form.formState.errors.withdrawlDetailsId && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.withdrawlDetailsId.message}
                            </p>
                        )}
                    </div>
                )}
                <FormImage
                    label="Upload Confirmation Image"
                    name="confirmationImageUrl"
                    control={form.control}
                />

                <Button
                    variant="platform-gradient-secondary"
                    size="lg"
                    type="submit"
                    className="py-1 h-9 text-sm md:text-base font-medium"
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

            {/* Payment Method Dialog */}
            {showPaymentMethodDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-full w-full">
                    <div className="bg-white dark:bg-primary-game w-full max-h-[90vh] overflow-hidden h-full">
                        <PaymentMethodDialog 
                            onBack={() => {
                                setShowPaymentMethodDialog(false);
                                refetchWithdrawDetails();
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Bank Transfer Deposit Form
const BankDepositForm = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
    const t = useTranslations('deposit');
    const tWithdraw = useTranslations('withdraw');
    const { mutate, isPending } = useCreateDepositRequest();
    const { data: companyQR, isFetching: isLoading, refetch } = useGetActiveCompanyQR({ type: CompanyQRType.BANK });
    const { data: withdrawDetailsData, isLoading: isLoadingWithdrawDetails, refetch: refetchWithdrawDetails } = useGetAllWithdrawDetails({});
    const { data: company } = useGetMyCompany();
    const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);

    const withdrawDetails = useMemo(() => {
        if (withdrawDetailsData?.data) {
            return withdrawDetailsData.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [withdrawDetailsData]);

    const activeWithdrawDetails = withdrawDetails.filter(
        (detail: { deletedAt: any }) => !detail.deletedAt
    );

    const onSubmit = async (data: DepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        const payload: any = {
            companyQrId: companyQR?.id,
            pgId: data.pgId,
            amount: data.amount ?? 0,
            confirmationImageUrl: data.confirmationImageUrl,
            withdrawlDetailsId: data.withdrawlDetailsId,
            paymentMethod,
        }
        if (company?.askWithdrawlOption && data.withdrawlDetailsId) {
            payload.withdrawlDetailsId = data.withdrawlDetailsId;
        }
        mutate(payload, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                }
                form.reset({ amount: 100, pgId: "", confirmationImageUrl: "", withdrawlDetailsId: "" });
            },
            onError: () => {
                toast.error('Error creating deposit request');
            }
        });
    }

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema(t, true)),
        defaultValues: { amount: 100, pgId: "", withdrawlDetailsId: "" },
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

    if (isLoading || isLoadingWithdrawDetails) {
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

                                {companyQR.accountHolderName && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-platform-text/80 text-sm">Account Holder Name:</span>
                                        <span className="text-platform-text font-medium">
                                            {companyQR.accountHolderName}
                                        </span>
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
                    required={false}
                />

                {/* Withdrawal Methods Selection */}
                {company?.askWithdrawlOption && <div className="space-y-2">
                    <div>
                        <span className="text-platform-text text-base font-medium">
                            {tWithdraw('select-method-label')}
                        </span>
                    </div>
                    <Controller
                        control={form.control}
                        name="withdrawlDetailsId"
                        render={({ field }) => (
                            <div className="grid grid-cols-1 gap-3 mt-2">
                                {activeWithdrawDetails.length === 0 ? (
                                    <>
                                        <p className="text-platform-text text-sm py-4 text-center">
                                            {tWithdraw('no-methods-found')}
                                        </p>
                                        <Button
                                            variant="platform-outline"
                                            size="lg"
                                            className="w-full"
                                            type="button"
                                            onClick={() => setShowPaymentMethodDialog(true)}
                                        >
                                            Add New Method
                                        </Button>
                                    </>
                                ) : (
                                    activeWithdrawDetails.map((detail: WithdrawDetailsRecord) => (
                                        <WithdrawMethodOption
                                            key={detail.id}
                                            detail={detail}
                                            selected={field.value === detail.id?.toString()}
                                            onClick={() => field.onChange(detail.id?.toString())}
                                            t={tWithdraw}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    />
                    {form.formState.errors.withdrawlDetailsId && (
                        <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.withdrawlDetailsId.message}
                        </p>
                    )}
                </div>
                }
                <FormImage
                    label="Confirmation Image"
                    control={form.control}
                    name="confirmationImageUrl"
                />

                <Button
                    variant="platform-gradient-secondary"
                    size="lg"
                    type="submit"
                    disabled={form.formState.isSubmitting || isPending}
                    className="py-1 h-9 text-sm md:text-base font-medium"
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

            {/* Payment Method Dialog */}
            {showPaymentMethodDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-primary-game rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                        <PaymentMethodDialog 
                            onBack={() => {
                                setShowPaymentMethodDialog(false);
                                refetchWithdrawDetails();
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Deposit Tab Component
const DepositTab = () => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
    return (
        <div className="md:space-y-6 space-y-4">
            <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700 px-4 py-2 text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                <span className="block font-normal md:font-medium text-center !text-xs md:text-sm">Deposit Processing Time</span>
                <span className="block md:text-xs text-[10px] mt-1 text-center">
                    Deposits are typically processed within <span className="font-semibold">5 to 15 minutes</span>. Please wait for confirmation before contacting support.
                </span>
            </div>

            <DepositMethods
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
            />

            {selectedMethod === PaymentMethod.UPI && <UPIDepositForm />}
            {selectedMethod === PaymentMethod.NEFT && <BankDepositForm paymentMethod={PaymentMethod.NEFT} />}
            {selectedMethod === PaymentMethod.RTGS && <BankDepositForm paymentMethod={PaymentMethod.RTGS} />}
            {selectedMethod === PaymentMethod.CRYPTO && <CryptoDepositForm />}
        </div>
    );
};

export default DepositTab;