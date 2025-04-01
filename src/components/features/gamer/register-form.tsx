"use client";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import FormPassword from "@/components/ui/form/form-password";
import { useTranslations } from "next-intl";
import { useGetCompanyById } from "@/react-query/company-queries";
import { COMPANYID, googleAuth } from "@/lib/utils";
import Company from "@/models/company";

// Zod schema for validating the registration form fields
export const createRegisterSchema = (t: any, isPhoneAllowed: boolean = false) => z.object({
    // Full name with first and last name
    name: z.string().min(3, { message: t('validation.name-length') }).max(100, { message: t('validation.name-max') }).refine((data) => data.split(" ").length > 1, {
        message: t('validation.name-full'),
    }),

    // Email or phone
    email: z
        .string()
        .refine(
            (value) => {

                // Email regex pattern
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (isPhoneAllowed) {
                    // Phone regex pattern (basic international format)
                    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
                    return emailPattern.test(value) || phonePattern.test(value);
                }

                return emailPattern.test(value);
            },
            {
                message: t('validation.email-invalid'),
            }
        ),

    // Optional reference code
    referenceCode: z.string().optional(),

    // Username
    username: z.string().max(100, { message: t('validation.username-max') }).nonempty({ message: t('validation.username-required') }),

    // Password
    password: z
        .string()
        .min(6, { message: t('validation.password-min') })
        .max(20, { message: t('validation.password-max') })
        .nonempty({ message: t('validation.password-required') }),
});

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

type Props = {
    defaultValues?: RegisterFormValues;
    onSubmit: (data: RegisterFormValues) => void;
    isLoading?: boolean;
};

const RegisterForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const t = useTranslations("register"); // Translation hook for register form

    const { data, isSuccess } = useGetCompanyById(COMPANYID.toString());

    const company = useMemo(() => {
        if (isSuccess) {
            return new Company(data?.data);
        }
    }, [isSuccess, data]);


    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(createRegisterSchema(t, company?.otpIntegration)),
        defaultValues,
    });


    const { control, handleSubmit } = form;
    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 text-white">{t('form-title')}</h1>
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <FormInput
                    control={control}
                    game
                    name="name"
                    label={t('label-full-name')}
                    required
                />
                {/* Username Field */}
                <FormInput
                    control={control}
                    game
                    name="username"
                    label={t('label-username')}
                    required
                />
                {/* Email Field */}
                <FormInput
                    control={control}
                    game
                    name="email"
                    description={company?.otpIntegration ? t('description-email-phone') : undefined}
                    label={company?.otpIntegration ? t('label-email-phone') : t('label-email')}
                    required
                />
                {/* Reference Code Field */}
                <FormInput
                    control={control}
                    game
                    name="referenceCode"
                    label={t('label-reference-code')}
                />
                {/* Password Field */}
                <FormPassword
                    control={control}
                    game
                    name="password"
                    type="password"
                    label={t('label-password')}
                    required
                />

                <footer className="flex justify-end flex-col gap-2 mt-12">
                    <p className="text-sm text-white text-center">{t('terms-message')}</p>
                    <Button type="submit" size="lg" variant="game" className="w-full" disabled={isLoading}>
                        {isLoading ? t('button-registering') : t('button-register')}
                    </Button>
                </footer>

                <div className="flex items-center justify-center gap-3 text-white">
                    <Separator className="my-6 flex-1 bg-white/20" />
                    <span>{t('or')}</span>
                    <Separator className="my-6 flex-1  bg-white/20" />
                </div>
            </FormProvider>
                <Button type="button" size="lg" variant="secondary" className="w-full bg-tertiary border-[#EFF8FF17] text-white" onClick={() => googleAuth()}>
                    <img className="mr-2 size-5" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" />
                    {t('button-google')}
                </Button>
                <Button variant="ghost" className="text-[#F9F9F9B2] hover:bg-transparent flex mt-8" fullWidth>
                    {t('have-account')}
                    <Link href="/game/auth/login" className="text-white">
                        {t('sign-in')}
                    </Link>
                </Button>
        </div>
    );
};

export default RegisterForm;
