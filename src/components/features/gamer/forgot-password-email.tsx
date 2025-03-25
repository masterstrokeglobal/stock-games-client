import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { COMPANYID } from '@/lib/utils';
import { Company } from '@/models/company';
import { useGetCompanyById } from '@/react-query/company-queries';
import { useTranslations } from 'next-intl'; // Import for translations

// Zod schema for validating the email input
export const forgotPasswordSchema = (t: any, phoneEnabled: boolean) => z.object({
    email: z
        .string()
        .refine(
            (value) => {
                // Email regex pattern
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (phoneEnabled) {
                    // Phone regex pattern (basic international format)
                    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
                    return emailPattern.test(value) || phonePattern.test(value);
                }

                return emailPattern.test(value);
            },
            {
                message: phoneEnabled ? t('validation.email-phone-invalid') : t('validation.email-invalid'),
            }
        ),

});


export type ForgotPasswordFormValues = z.infer<ReturnType<typeof forgotPasswordSchema>>;

type Props = {
    onSubmit: (data: ForgotPasswordFormValues) => void;
    isLoading?: boolean;
};

const ForgotPasswordEmailForm: React.FC<Props> = ({
    onSubmit,
    isLoading
}) => {
    const t = useTranslations('forgotPassword');  // Use translation hook

    const { data, isSuccess } = useGetCompanyById(COMPANYID.toString());
    const company = useMemo(() => {
        if (isSuccess) {
            return new Company(data?.data);
        }
    }, [isSuccess, data]);
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema(t, company?.otpIntegration ?? false)),
        defaultValues: {
            email: ''
        }
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 font-semibold text-white">
                {t('title')}
            </h1>

            <p className="text-center text-white/70 mb-6">
                {t('description')}
            </p>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormInput
                    control={control}
                    game
                    name="email"
                    label={company?.otpIntegration ? t('email-phone.label') : t('email.label')}
                />

                <Button
                    type="submit"
                    size="lg"
                    variant="game"
                    className="w-full mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? t('button.sending') : t('button.sendCode')}
                </Button>
            </FormProvider>
        </div>
    );
};

export default ForgotPasswordEmailForm;
