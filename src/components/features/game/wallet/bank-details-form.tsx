import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormPassword from "@/components/ui/form/form-password";

// Zod schema for bank account or UPI form validation
export const createWithdrawDetailsSchema = z.object({
    id: z.number().optional(),
    accountName: z.string().min(1, "Account name is required").max(100).optional(),
    accountNumber: z.string().length(16, "Account number must be 16 digits").regex(/^\d+$/, "Account number must contain only digits").optional(),
    ifscCode: z.string().length(11, "IFSC code must be 11 characters").regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format. Example: SBIN0012345").optional(),
    upiId: z.string().refine((value) => value.includes("@"), "Invalid UPI ID format. Example: example@bank").optional(),
}).refine((data) => (data.upiId && !data.accountNumber && !data.ifscCode) ||
    (!data.upiId && data.accountNumber && data.ifscCode), {
    message: "Provide either bank details or a UPI ID, not both",
});


export type BankAccountFormValues = z.infer<typeof createWithdrawDetailsSchema>;

type Props = {
    defaultValues?: BankAccountFormValues;
    onSubmit: (data: BankAccountFormValues) => void;
    isLoading?: boolean;
    isUPI?: boolean;
};

const BankAccountForm = ({ defaultValues, onSubmit, isLoading, isUPI }: Props) => {
    const defaultData = isUPI ? { upiId: "" } : { cardHolder: "", accountNumber: "", ifscCode: "" };
    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(createWithdrawDetailsSchema),
        defaultValues: {
            ...defaultData,
            ...defaultValues,
        },
    });

    const { control, handleSubmit } = form;

    console.log(form.formState.errors);

    return (
        <div className="w-full max-w-xl flex flex-col space-y-4 h-full">
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit, (err) => console.log(err))} className="w-full h-full flex flex-col space-y-4">
                {isUPI ? (
                    // UPI ID Field
                    <FormInput
                        control={control}
                        name="upiId"
                        label="UPI ID*"
                        game
                        required
                        placeholder="example@bank"
                    />
                ) : (
                    <>
                        {/* Card Holder Name Field */}
                        <FormInput
                            control={control}
                            name="accountName"
                            game
                            label="Account Holder Name*"
                            required
                        />

                        {/* Account Number Field */}
                        <FormPassword
                            control={control}
                            name="accountNumber"
                            game
                            label="Account Number*"
                            required
                            type="password"
                            maxLength={16}
                        />

                        {/* IFSC Code Field */}
                        <FormInput
                            control={control}
                            name="ifscCode"
                            game
                            label="IFSC Code*"
                            required
                            placeholder="SBIN0012345"
                        />
                    </>
                )}
                <footer className="flex justify-end ">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Payment Method"}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default BankAccountForm;
