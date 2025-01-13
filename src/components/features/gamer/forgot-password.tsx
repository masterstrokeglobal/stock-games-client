"use client";
import { Button } from "@/components/ui/button";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

export const createResetPasswordSchema = (t: any) => z.object({
    password: z
        .string()
        .min(6, t('validation.password-min'))
        .max(20, t('validation.password-max'))
        .nonempty(t('validation.password-required')),
    confirmPassword: z
        .string()
        .min(6, t('validation.password-min'))
        .max(20, t('validation.password-max'))
        .nonempty(t('validation.confirm-password-required')),
}).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwords-mismatch'),
    path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;

type Props = {
    defaultValues?: ResetPasswordFormValues;
    onSubmit: (data: ResetPasswordFormValues) => void;
    isLoading?: boolean;
    onBack?: () => void;
};

const ResetPasswordForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const t = useTranslations('reset-password');

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(createResetPasswordSchema(t)),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <div className="space-y-2 md:text-center mb-10">
                <h1 className="text-3xl font-semibold text-white">
                    {t('title')}
                </h1>
                <p className="text-sm text-[#F9F9F9B2]">
                    {t('description')}
                </p>
            </div>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormPassword
                    control={control}
                    game
                    name="password"
                    type="password"
                    label={t('labels.new-password')}
                    required
                />

                <FormPassword
                    control={control}
                    game
                    name="confirmPassword"
                    type="password"
                    label={t('labels.confirm-password')}
                    required
                />

                <footer className="flex justify-end flex-col gap-2">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? t('buttons.resetting') : t('buttons.reset-password')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default ResetPasswordForm;