import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useTranslations } from 'next-intl'; // Import for translations


// Zod schema for validating the email input
export const forgotPasswordSchema = (t: any) => z.object({
    email: z
        .string()
        .email(t('email.validation.invalid')) // Dynamic error message for invalid email
        .nonempty(t('email.validation.required')) // Dynamic error message for required email
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

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema(t)),
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
                    label={t('email.label')}
                    type="email"
                    required
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
