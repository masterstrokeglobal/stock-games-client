import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormSelect from "@/components/ui/form/form-select";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Banknote, Loader2 } from "lucide-react";

// Zod schema for withdrawal form validation
const withdrawSchema = z.object({
    account: z.string().min(1, "Please select an account"),
    amount: z.coerce.number({ message: "Amount must be a number" }).min(1, "Amount is required"),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;

type Props = {
    onSubmit: (data: WithdrawFormValues) => void;
    accounts: { id: string; name: string; balance: number }[];
};

const WithdrawForm = ({ onSubmit, accounts }: Props) => {
    const [success, setSuccess] = React.useState(false);

    const form = useForm<WithdrawFormValues>({
        defaultValues: {
            account: '',
            amount: 0,
        },
    });

    const { control, handleSubmit, watch } = form;

    const selectedAccount = watch("account");

    const selectedAccountDetails = accounts.find(acc => acc.id === selectedAccount);

    return (
        <div className="w-full max-w-sm flex flex-col min-h-[calc(100vh-5rem)]">
            <header>
                <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                    Withdraw Funds
                </h2>
                <p className="text-[#6A84C3] text-center text-sm">
                    Select an account and enter the amount you wish to withdraw.
                </p>
            </header>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-8 flex flex-col"
            >
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
                    >
                        Withdraw Funds
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default WithdrawForm;
