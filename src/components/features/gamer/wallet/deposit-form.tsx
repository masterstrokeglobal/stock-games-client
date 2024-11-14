import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for deposit form
const depositSchema = z.object({
    transactionId: z
        .string()
        .min(1, "Transaction ID is required")
        .max(50, "Transaction ID is too long"),
    amount: z
        .coerce.number({
            message: "Amount must be a number"
        })
        .min(1, "Amount is required")
});

export type DepositFormValues = z.infer<typeof depositSchema>;

type Props = {
    onSubmit: (data: DepositFormValues) => void;
};


const DepositForm = ({ onSubmit }: Props) => {

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            transactionId: '',
            amount:0,
        }
    });

    const { control, handleSubmit } = form;


    return (
        <div className="w-full max-w-sm flex flex-col min-h-[calc(100vh-5rem)]">

            {/* QR Code Section */}
            <header>
                <h2 className="text-2xl font-semibold text-center mb-2 text-white">Scan QR Code                </h2>

                <p className="text-[#6A84C3] text-center text-sm">
                    Scan the QR code with your banking app to initiate the deposit process.
                </p>
                <div className="bg-white p-4 rounded-lg w-fit mx-auto mt-4">
                    <img src="/qr.png" alt="" />
                </div>
            </header>



            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-8 flex flex-col"
            >
                <div className="space-y-4 flex-1">
                    <FormInput
                        control={control}
                        game
                        name="transactionId"
                        label="Transaction ID*"
                        placeholder="Enter transaction ID from your bank app"
                        required
                    />

                    <FormInput
                        control={control}
                        game
                        name="amount"
                        label="Deposit Amount*"
                        placeholder="Enter amount to deposit"
                        type="number"
                        required
                    />
                </div>

                <footer className="mt-auto pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                    >
                        Confirm Deposit
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default DepositForm;