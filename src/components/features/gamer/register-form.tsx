"use client";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormPhoneNumber from "@/components/ui/form/form-phone-input";
import FormProvider from "@/components/ui/form/form-provider";
import { Separator } from "@/components/ui/separator";
import { COMPANYID } from "@/lib/utils";
import Company from "@/models/company";
import { useGetCompanyById } from "@/react-query/company-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthTabs from "./auth-tabs";
import GoogleLoginButton from "./google-login-button";

// Zod schema for validating the registration form fields
export const createRegisterSchema = (t: any, isPhoneAllowed: boolean = false, userVerfication: boolean = false) => z.object({
    // Full name with first and last name
    name: z.string().min(3, { message: t('validation.name-length') }).max(100, { message: t('validation.name-max') }).refine((data) => data.split(" ").length > 1, {
        message: t('validation.name-full'),
    }),

    // Email or phone
    email: userVerfication
        ? z
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
            )
        : z.string().optional(),

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
    const isUserVerificationRequired = data?.data?.userVerfication;

    const company = useMemo(() => {
        if (isSuccess) {
            return new Company(data?.data);
        }
    }, [isSuccess, data]);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(createRegisterSchema(t, company?.otpIntegration, isUserVerificationRequired)),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <AuthTabs />

            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-2">
                    {/* Name Field */}
                    <FormInput
                        control={control}
                        game
                        className="text-white"
                        inputClassName="!h-10"
                        name="name"
                        label={t('label-full-name')}
                        required
                    />
                    {/* Username Field */}
                    <FormInput
                        control={control}
                        game
                        name="username"
                        inputClassName="!h-10"
                        label={t('label-username')}
                        required
                    />

                    {isUserVerificationRequired && <>{
                        company?.otpIntegration ? (
                            <FormPhoneNumber
                                control={control}
                                name="email"
                                game
                                inputClassName="!h-10"
                                label={t('label-phone')}
                            />
                        ) : (
                            <FormInput
                                control={control}
                                game
                                name="email"
                                inputClassName="!h-10"
                                label={t('label-email')}
                            />
                        )
                    }
                    </>}
                    {/* Reference Code Field */}
                    <FormInput
                        control={control}
                        game
                        name="referenceCode"
                        inputClassName="!h-10"
                        label={t('label-reference-code')}
                    />
                    {/* Password Field */}
                    <FormPassword
                        control={control}
                        game
                        name="password"
                        type="password"
                        inputClassName="!h-10"
                        label={t('label-password')}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="game"
                    className="w-full mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? t('button-registering') : t('button-register')}
                </Button>
            </FormProvider>

            <div className="flex items-center my-2 justify-center gap-2 text-white text-sm">
                <Separator className="my-3 flex-1 bg-white/20" />
                <span>{t('or')}</span>
                <Separator className="my-3 flex-1 bg-white/20" />
            </div>

            <GoogleLoginButton />
        </div>
    );
};

export default RegisterForm;