"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const depositOperatorSchema = z.object({
    amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type DepositOperatorFormValues = z.infer<typeof depositOperatorSchema>;

type Props = {
    onSubmit: (data: DepositOperatorFormValues) => void;
    operatorId: string;
    isLoading?: boolean;
    currentBalance?: number;
};

const DepositOperatorForm = ({
    onSubmit,
    operatorId,
    isLoading,
    currentBalance = 0
}: Props) => {
    const form = useForm<DepositOperatorFormValues>({
        resolver: zodResolver(depositOperatorSchema),
        defaultValues: {
            amount: 0
        },
    });

    const { control, handleSubmit, watch } = form;
    const amountValue = watch("amount");

    return (
        <div className="space-y-6">
            {/* Current Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Your Wallet Balance</h3>
                        <p className="text-blue-100">Available for deposits</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">
                            ₹{currentBalance.toLocaleString()}
                        </div>
                        <p className="text-blue-100 text-sm">Current Balance</p>
                    </div>
                </div>
            </div>

            {/* Deposit Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="text-xl font-semibold mb-4">Deposit to Operator Wallet</h4>
                
                <FormProvider
                    methods={form}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Operator ID Display */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Operator ID
                        </label>
                        <p className="text-gray-900 font-mono">{operatorId}</p>
                    </div>

                    <FormInput
                        control={control}
                        name="amount"
                        label="Amount*"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Enter amount to deposit"
                    />

                    {/* Amount Validation Display */}
                    {amountValue > currentBalance && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-600 text-sm">
                                ⚠️ Insufficient balance. You can deposit up to ₹{currentBalance.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {amountValue > 0 && amountValue <= currentBalance && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <p className="text-green-600 text-sm">
                                ✓ Depositing ₹{amountValue.toLocaleString()} to operator wallet
                            </p>
                        </div>
                    )}

                    <footer className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || amountValue > currentBalance || amountValue <= 0}
                        >
                            {isLoading ? "Processing..." : "Deposit Amount"}
                        </Button>
                    </footer>
                </FormProvider>
            </div>
        </div>
    );
};

export default DepositOperatorForm;
