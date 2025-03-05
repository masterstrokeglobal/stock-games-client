"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { Loader2 } from "lucide-react";

const walletFormSchema = z.object({
    amount: z.coerce
        .number()
        .refine(
            (value) => {
                return !isNaN(value) && value > 0;
            },
            { message: "Amount must be a positive number" }
        ),
});

export type WalletFormValues = z.infer<typeof walletFormSchema>;

type Props = {
    title?: string;
    onSubmit: (values: WalletFormValues) => void;
    isSubmitting?: boolean;
}

const WalletForm = ({
    title = "Request Funds to Wallet",
    onSubmit,
    isSubmitting
}: Props) => {

    const form = useForm({
        resolver: zodResolver(walletFormSchema),
        defaultValues: {
            amount: 0
        }
    });

    const handleSubmit = (values: WalletFormValues) => {
        onSubmit(values);
        form.reset();
    };


    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </CardHeader>
            <FormProvider
                className="w-full"
                methods={form}
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <CardContent>
                    <div className="relative">
                        <div className="absolute left-3 top-8 text-gray-500">
                            Rs.
                        </div>
                        <FormInput
                            control={form.control}
                            label="Amount"
                            name="amount"
                            type="text"
                            placeholder="0.00"
                            className="pl-10"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter the amount as per your requirement
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        disabled={isSubmitting}
                        className="w-full"
                        type="submit"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Submit "
                        )}
                    </Button>
                </CardFooter>
            </FormProvider>
        </Card>
    );
};

export default WalletForm;