import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import useWallet from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import { useCreateWithdrawalRequest } from "@/react-query/payment-queries";
import { useGetAllWithdrawDetails } from "@/react-query/withdrawl-details-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Move schema outside component to prevent recreating on every render
const createWithdrawSchema = (t: any, totalAmount: number) => z.object({
    withdrawDetails: z.string().min(1, t('validation.withdrawal-method-required')),
    amount: z.coerce
        .number({ message: t('validation.amount-invalid') })
        .min(1, t('validation.amount-required'))
        .refine((val) => val <= totalAmount, t('validation.amount-exceeds-balance')),
});

export type WithdrawFormValues = z.infer<ReturnType<typeof createWithdrawSchema>>;

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


const WithdrawTab: React.FC = () => {
    const wallet = useWallet();
    const { mutate, isPending } = useCreateWithdrawalRequest();

    const t = useTranslations('withdraw');
    const { data, isLoading: isLoadingDetails, isSuccess, isError } = useGetAllWithdrawDetails({});

    const withdrawDetails = useMemo(() => {
        if (isSuccess && data?.data) {
            return data.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [data, isSuccess]);

    const withdrawSchema = useMemo(
        () => createWithdrawSchema(t, wallet.mainBalance!),
        [t, wallet.mainBalance]
    );

    const form = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            withdrawDetails: '',
            amount: 0,
        },
    });

    const { control, handleSubmit } = form;

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    };

    if (isLoadingDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#3B4BFF]" />
                <p className="text-[#6A84C3] mt-4">{t('loading-methods')}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">{t('error-loading')}</p>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="text-[#6A84C3]"
                >
                    {t('try-again')}
                </Button>
            </div>
        );
    }

    const activeWithdrawDetails = withdrawDetails.filter(
        (detail: { deletedAt: any }) => !detail.deletedAt
    );

    const onSubmitWithdrawal = (data: WithdrawFormValues) => {
        mutate(data, {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    return (
        <FormProvider
            methods={form}
            onSubmit={handleSubmit(onSubmitWithdrawal)}
            className="space-y-8"
        >
            {/* Total Balance Card */}
            <div className="w-full flex flex-col items-center">
                <div className="w-full  border-2 dark:border-platform-border border-primary-game dark:bg-transparent bg-primary-game rounded-md px-6 py-5 flex items-center gap-4 shadow-lg mb-2">
                    <div className="flex-shrink-0">
                        <img
                            src="/images/coins/star-coin.png"
                            className="rounded-full w-10 h-10"
                            alt="coin"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-platform-text text-xs font-medium">
                            {t('total-balance')}
                        </span>
                        <span className="text-platform-text text-2xl font-bold">
                            {formatNumber(wallet.mainBalance!)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                {/* Custom outlined input with floating label style */}
                <div className="relative w-full">
                    <label
                        htmlFor="withdraw-amount"
                            className="absolute -top-2 left-4 dark:bg-[#0A0C2A] bg-[#C3E3FF] px-1 text-platform-text font-semibold text-sm z-10"
                        style={{
                            transform: "translateY(-50%)",
                            pointerEvents: "none"
                        }}
                    >
                        {t('withdrawal-amount-label')}
                    </label>
                    <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <input
                                {...field}
                                id="withdraw-amount"
                                type="number"
                                placeholder={t('withdrawal-amount-placeholder')}
                                required
                                className="w-full border-2 dark:border-platform-border border-primary-game rounded-md bg-transparent text-platform-text text-base px-4 py-3 outline-none focus:border-[#6A84C3] transition-colors placeholder:text-[#6A84C3]"
                            />
                        )}
                    />
                </div>
                {/* <div className="flex items-center gap-2 text-yellow-400 text-sm px-1">
                    <span>💰</span>
                    <span>
                        Minimum withdrawal is ₹{MIN_WITHDRAWAL}!
                    </span>
                </div> */}
            </div>

            {/* Divider */}
            <div className="w-full border-t border-[#232D4B] my-2" />

            {/* Withdrawal Methods */}
            <div className="space-y-2">
                <div>
                    <span className="text-platform-text text-base font-medium">
                        {t('select-method-label')}
                    </span>
                    <p className="text-platform-text text-sm mt-1">
                        Each Option May Have Different Processing Times And Limits.
                    </p>
                </div>
                <Controller
                    control={control}
                    name="withdrawDetails"
                    render={({ field }) => (
                        <div className="grid grid-cols-1  gap-3 mt-2">
                            {activeWithdrawDetails.length === 0 ? (
                                <p className="text-platform-text text-sm py-4 text-center col-span-3">
                                    {t('no-methods-found')}
                                </p>
                            ) : (
                                activeWithdrawDetails.map((detail: WithdrawDetailsRecord) => (
                                    <WithdrawMethodOption
                                        key={detail.id}
                                        detail={detail}
                                        selected={field.value === detail.id?.toString()}
                                        onClick={() => field.onChange(detail.id?.toString())}
                                        t={t}
                                    />
                                ))
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Withdraw Button */}
            <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r dark:from-[#3B4BFF] dark:to-[#262BB5] from-primary-game to-primary-game rounded-md text-white font-semibold text-lg py-3 border-2 dark:border-platform-border border-primary-game dark:hover:from-[#4B5BFF] dark:hover:to-[#3B3BC5] hover:from-[#64B6FD] hover:to-[#466CCF] transition-all"
                disabled={isPending || activeWithdrawDetails.length === 0}
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('processing')}
                    </>
                ) : (
                    t('withdraw-funds')
                )}
            </Button>
        </FormProvider>
    );
};

export default WithdrawTab;
