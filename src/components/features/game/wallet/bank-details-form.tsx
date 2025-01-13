import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormPassword from "@/components/ui/form/form-password";
import { useTranslations } from "next-intl";

export const createWithdrawDetailsSchema = (t: any) => z.object({
    id: z.number().optional(),
    accountName: z.string()
        .min(1, t('validation.account-name-required'))
        .max(100)
        .optional(),
    accountNumber: z.string()
        .length(16, t('validation.account-number-length'))
        .regex(/^\d+$/, t('validation.account-number-digits'))
        .optional(),
    ifscCode: z.string()
        .length(11, t('validation.ifsc-length'))
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, t('validation.ifsc-format'))
        .optional(),
    upiId: z.string()
        .refine((value) => value.includes("@"), t('validation.upi-format'))
        .optional(),
}).refine(
    (data) => 
        (data.upiId && !data.accountNumber && !data.ifscCode) ||
        (!data.upiId && data.accountNumber && data.ifscCode),
    {
        message: t('validation.provide-one-method')
    }
);

export type BankAccountFormValues = z.infer<ReturnType<typeof createWithdrawDetailsSchema>>;

type Props = {
    defaultValues?: BankAccountFormValues;
    onSubmit: (data: BankAccountFormValues) => void;
    isLoading?: boolean;
    isUPI?: boolean;
};

const BankAccountForm = ({ defaultValues, onSubmit, isLoading, isUPI }: Props) => {
    const t = useTranslations('bank-form');
    
    const defaultData = isUPI 
        ? { upiId: "" } 
        : { cardHolder: "", accountNumber: "", ifscCode: "" };
        
    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(createWithdrawDetailsSchema(t)),
        defaultValues: {
            ...defaultData,
            ...defaultValues,
        },
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-xl flex flex-col space-y-4 h-full">
            <FormProvider 
                methods={form} 
                onSubmit={handleSubmit(onSubmit, (err) => console.log(err))} 
                className="w-full h-full flex flex-col space-y-4"
            >
                {isUPI ? (
                    <FormInput
                        control={control}
                        name="upiId"
                        label={t('upi-id-label')}
                        game
                        required
                        placeholder={t('upi-id-placeholder')}
                    />
                ) : (
                    <>
                        <FormInput
                            control={control}
                            name="accountName"
                            game
                            label={t('account-name-label')}
                            required
                        />

                        <FormPassword
                            control={control}
                            name="accountNumber"
                            game
                            label={t('account-number-label')}
                            required
                            type="password"
                            maxLength={16}
                        />

                        <FormInput
                            control={control}
                            name="ifscCode"
                            game
                            label={t('ifsc-code-label')}
                            required
                            placeholder={t('ifsc-code-placeholder')}
                        />
                    </>
                )}
                <footer className="flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? t('saving') : t('save-method')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default BankAccountForm;