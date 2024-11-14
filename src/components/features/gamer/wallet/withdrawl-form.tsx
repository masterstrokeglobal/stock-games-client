import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { PlusCircle, Loader2 } from "lucide-react";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import { useGetAllWithdrawDetails } from "@/react-query/withdrawl-details-queries";

const withdrawSchema = z.object({
    withdrawDetail: z.string().min(1, "Please select a withdrawal method"),
    amount: z.coerce.number({ message: "Amount must be a number" }).min(1, "Amount is required"),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;

const WithdrawMethodOption = ({
    detail,
    selected,
    onClick
}: {
    detail: WithdrawDetailsRecord;
    selected: boolean;
    onClick: () => void;
}) => {
    const displayInfo = detail.isUpi ? (
        // UPI Display
        <div>
            <p className="text-white font-medium">UPI ID</p>
            <p className="text-[#6A84C3] text-sm">{detail.upiId}</p>
        </div>
    ) : (
        // Bank Account Display
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
                {detail.isUpi ? 'UPI' : 'Bank'}
            </div>
        </div>
    );
};

type Props = {
    onSubmit: (data: WithdrawFormValues) => void;
    isLoading?: boolean;
    totalAmount: number;
};

const WithdrawForm = ({
    onSubmit,
    isLoading: isSubmitting,
    totalAmount,
}: Props) => {
    const { data, isLoading: isLoadingDetails, isSuccess, isError } = useGetAllWithdrawDetails({});

    const withdrawDetails = useMemo(() => {
        if (isSuccess && data?.data) {
            return data.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [data, isSuccess]);

    const form = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            withdrawDetail: '',
            amount: 0,
        },
    });

    const { control, handleSubmit, watch, formState: { errors } } = form;

    // Watch the amount field to display it dynamically
    const enteredAmount = watch("amount");

    if (isLoadingDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#4C6EF5]" />
                <p className="text-[#6A84C3] mt-4">Loading withdrawal methods...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <p className="text-red-500 mb-4">Failed to load withdrawal methods</p>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="text-[#6A84C3]"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    const activeWithdrawDetails = withdrawDetails.filter((detail: { deletedAt: any; }) => !detail.deletedAt);

    return (
        <div className="w-full max-w-sm flex flex-col min-h-[calc(100vh-5rem)]">
            <header>
                <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                    Withdraw Funds
                </h2>
                <p className="text-[#6A84C3] text-center text-sm">
                    Select a withdrawal method and enter the amount.
                </p>
            </header>

            {/* Available Balance and Entered Amount */}
            <div className="text-center mb-4">
                <p className="text-lg font-semibold text-white">
                    Available Balance: ₹{totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-[#6A84C3]">
                    Entered Amount: ₹{enteredAmount || 0}
                </p>
            </div>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-4 flex flex-col"
            >
                {/* Withdrawal Methods */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Select Withdrawal Method*
                    </label>
                    <Controller
                        control={control}
                        name="withdrawDetail"
                        render={({ field }) => (
                            <div className="space-y-2">
                                {activeWithdrawDetails.length === 0 ? (
                                    <p className="text-[#6A84C3] text-sm py-4 text-center">
                                        No withdrawal methods found. Please add a payment method.
                                    </p>
                                ) : (
                                    activeWithdrawDetails.map((detail: WithdrawDetailsRecord) => (
                                        <WithdrawMethodOption
                                            key={detail.id}
                                            detail={detail}
                                            selected={field.value === detail.id?.toString()}
                                            onClick={() => field.onChange(detail.id?.toString())}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Withdrawal Amount Input */}
                <FormInput
                    control={control}
                    game
                    name="amount"
                    label="Withdrawal Amount*"
                    placeholder="Enter amount to withdraw"
                    type="number"
                    required
                />

                {/* Submit Button */}
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
                                Processing...
                            </>
                        ) : (
                            'Withdraw Funds'
                        )}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};



export default WithdrawForm;