"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useDepositCoinsToCompanyWallet } from "@/react-query/payment-queries";
import { Loader2 } from "lucide-react";

const superAdminWalletFormSchema = z.object({
    companyWalletId: z.string().min(1, { message: "Company ID is required" }),
    balance: z.coerce
        .number()
        .refine(
            (value) => {
                return !isNaN(value) && value > 0;
            },
            { message: "balance must be a positive number" }
        ),
});

export type SuperAdminWalletFormValues = z.infer<typeof superAdminWalletFormSchema>;

type Props = {
    title?: string;
    defaultCompanyWalletId?: string;
}

const SuperAdminCompanyDepositForm = ({
    title = "Add Funds to Company Wallet",
    defaultCompanyWalletId = "",
}: Props) => {
    const { mutate, isPending } = useDepositCoinsToCompanyWallet();

    const form = useForm({
        resolver: zodResolver(superAdminWalletFormSchema),
        defaultValues: {
            companyWalletId: defaultCompanyWalletId,
            balance: 0
        }
    });

    const onSubmit = (formValue: SuperAdminWalletFormValues) => {
        mutate(formValue, {
            onSuccess: () => {
                form.reset({
                    companyWalletId: formValue.companyWalletId,
                    balance: 0
                });
            }
        });
    }

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </CardHeader>
            <FormProvider
                className="w-full"
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <CardContent className="space-y-4">

                    <div className="relative">
                        <div className="absolute left-3 top-8 text-gray-500">
                            Rs.
                        </div>
                        <FormInput
                            control={form.control}
                            label="balance"
                            name="balance"
                            type="text"
                            placeholder="0.00"
                            className="pl-10"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter the balance you want to add to the company wallet
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        disabled={isPending}
                        className="w-full"
                        type="submit"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Add to Company Wallet"
                        )}
                    </Button>
                </CardFooter>
            </FormProvider>
        </Card>
    );
};

export default SuperAdminCompanyDepositForm;