import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import { useGetAllWithdrawDetails } from "@/react-query/withdrawl-details-queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

// Move schema outside component to prevent recreating on every render
const createWithdrawSchema = (t: any,totalAmount:number) => z.object({
    withdrawDetails: z.string().min(1, t('validation.withdrawal-method-required')),
    amount: z.coerce
        .number({ message: t('validation.amount-invalid') })
        .min(1, t('validation.amount-required'))
        // Add max validation based on total amount
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
    const displayInfo = detail.isUpi ? (
        <div>
            <p className="text-white font-medium">{t('upi-id')}</p>
            <p className="text-[#6A84C3] text-sm">{detail.upiId}</p>
        </div>
    ) : (
        <div>
            <p className="text-white font-medium">{detail.accountName}</p>
            <p className="text-[#6A84C3] text-sm">
                {detail.ifscCode} • ****{detail.accountNumber?.slice(-4)}
            </p>
        </div>
    );

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between p-4 rounded-lg cursor-pointer",
                "bg-[#1A2238] transition-all duration-200",
                "hover:bg-[#232D4B]",
                selected && "border-2 border-[#4C6EF5]"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-3 h-3 rounded-full",
                    selected ? "bg-[#4C6EF5]" : "border-2 border-[#6A84C3]"
                )} />
                {displayInfo}
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-[#2A3655] text-[#6A84C3]">
                {detail.isUpi ? t('upi') : t('bank')}
            </div>
        </div>
    );
};

interface WithdrawFormProps {
    onSubmit: (data: WithdrawFormValues) => void;
    isLoading?: boolean;
    totalAmount: number;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({
    onSubmit,
    isLoading: isSubmitting,
    totalAmount,
}) => {
    const t = useTranslations('withdraw');
    const { data, isLoading: isLoadingDetails, isSuccess, isError } = useGetAllWithdrawDetails({});

    const withdrawDetails = useMemo(() => {
        if (isSuccess && data?.data) {
            return data.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [data, isSuccess]);

    const withdrawSchema = useMemo(() => createWithdrawSchema(t,totalAmount), [t,totalAmount]);

    const form = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            withdrawDetails: '',
            amount: 0,
        },
    });

    const { control, handleSubmit, watch } = form;
    const withdrawAmount = watch('amount');

    // Calculate fees and total amount
    const platformFee = useMemo(() => withdrawAmount * 0.04, [withdrawAmount]);
    const totalWithdrawAmount = useMemo(() => Number(withdrawAmount) + Number(platformFee), [withdrawAmount, platformFee]);

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    };

    if (isLoadingDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#4C6EF5]" />
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

    const activeWithdrawDetails = withdrawDetails.filter((detail: { deletedAt: any; }) => !detail.deletedAt);

    return (
        <div className="w-full max-w-sm flex flex-col min-h-[calc(100vh-5rem)]">
            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-4 flex flex-col"
            >
                <div>
                    <Label className="text-sm font-medium text-white">
                        {t('total-balance')}
                    </Label>
                    <div className="flex justify-center relative mb-2">
                        <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                            <img src="/coin.svg" className="shadow-custom-glow rounded-full" alt="coin" />
                        </div>
                        <Input
                            placeholder={t('enter-bet-amount')}
                            value={formatNumber(totalAmount)}
                            disabled
                            className="bg-[#101F44] p-2 text-white pl-14 h-14 text-xl"
                        />
                    </div>
                </div>

                <FormInput
                    control={control}
                    game
                    name="amount"
                    label={t('withdrawal-amount-label')}
                    placeholder={t('withdrawal-amount-placeholder')}
                    type="number"
                    required
                />

                {withdrawAmount > 0 && (
                    <div className="bg-[#1A2238] p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6A84C3]">{t('withdrawal-amount')}</span>
                            <span className="text-white">{formatNumber(withdrawAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#6A84C3]">{t('platform-fee')} (4%)</span>
                            <span className="text-white">+{formatNumber(platformFee)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium border-t border-[#2A3655] pt-2 mt-2">
                            <span className="text-[#6A84C3]">{t('total-amount')}</span>
                            <span className="text-white">{formatNumber(totalWithdrawAmount)}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        {t('select-method-label')}
                    </label>
                    <Controller
                        control={control}
                        name="withdrawDetails"
                        render={({ field }) => (
                            <div className="space-y-2">
                                {activeWithdrawDetails.length === 0 ? (
                                    <p className="text-[#6A84C3] text-sm py-4 text-center">
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

                <footer className="mt-auto pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isSubmitting || activeWithdrawDetails.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t('processing')}
                            </>
                        ) : (
                            t('withdraw-funds')
                        )}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default WithdrawForm;