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

const withdrawSchema = z.object({
    withdrawDetails: z.string().min(1, "Please select a withdrawal method"),
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
            withdrawDetails: '',
            amount: 0,
        },
    });

    const { control, handleSubmit} = form;


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

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-4 flex flex-col"
            >
                {/* Withdrawal Amount Input */}
                <div>

                    <Label className="text-sm font-medium text-white">
                        Total Balance
                    </Label>
                    <div className="flex justify-center relative mb-2">

                        <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full" >
                            <img src="/coin.svg" className='shadow-custom-glow  rounded-full' alt="coin" />
                        </div>
                        <Input
                            placeholder="Enter bet amount"
                            value={totalAmount}
                            disabled

                            className="bg-[#101F44] p-2 text-white  pl-14 h-14 text-xl"
                        />
                    </div>
                </div>

                <FormInput
                    control={control}
                    game
                    name="amount"
                    label="Withdrawal Amount*"
                    placeholder="Enter amount to withdraw"
                    type="number"
                    required
                />

                {/* Withdrawal Methods */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Select Withdrawal Method*
                    </label>
                    <Controller
                        control={control}
                        name="withdrawDetails"
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