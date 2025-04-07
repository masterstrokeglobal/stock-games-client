"use client";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import DemoUserLogin from "@/components/auth/demo-user-login";

export const createLoginSchema = (t: any) => z.object({
    username: z.string(),
    password: z
        .string()
        .min(6, t('validation.password-min'))
        .max(20, t('validation.password-max'))
        .nonempty(t('validation.password-required')),
});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

type Props = {
    defaultValues?: LoginFormValues;
    onSubmit: (data: LoginFormValues) => void;
    onForgotPassword: () => void;
    isLoading?: boolean;
};

const LoginForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const t = useTranslations('auth');

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(createLoginSchema(t)),
        defaultValues,
    });

    const { control, handleSubmit } = form;
    const googleAuth = () => {
        window.open(
            ` ${process.env.NEXT_PUBLIC_API_URL}auth/google?companyId=${process.env.NEXT_PUBLIC_COMPANY_ID}`,
            "_self"
        );
    };
    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 font-semibold text-white">
                {t('titles.welcome-back')}
            </h1>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormInput
                    control={control}
                    game
                    name="username"
                    label={t('labels.username-email')}
                    required
                />

                <div className="space-y-2">
                    <FormPassword
                        control={control}
                        game
                        name="password"
                        type="password"
                        label={t('labels.password')}
                        required
                    />

                    <Link
                        href="/game/auth/forgot-password"
                        className="text-white text-sm ml-auto text-end mt-1 block"
                    >
                        {t('links.forgot-password')}
                    </Link>
                </div>

                <footer className="flex justify-end flex-col gap-2 mt-12">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? t('buttons.signing-in') : t('buttons.sign-in')}
                    </Button>
                </footer>


                <div className="mt-8">
                    <Link href="/game/auth/register" className="text-white">
                        <Button variant="ghost" fullWidth>
                            {t('buttons.create-account')}
                        </Button>
                    </Link>
                </div>
            </FormProvider>

            <div className="flex items-center justify-center gap-3 text-white">
                <Separator className="my-6 flex-1 bg-white/20" />
                <span>{t('common.or')}</span>
                <Separator className="my-6 flex-1 bg-white/20" />
            </div>

            <Button
                type="button"
                size="lg"
                onClick={() => googleAuth()}
                variant="secondary"
                className="w-full bg-[#182B5A] border-[#EFF8FF17] text-white"
            >
                <img
                    className="mr-2 size-5"
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
                    alt={t('alt.google-logo')}
                />
                {t('buttons.continue-with-google')}
            </Button>

            <DemoUserLogin className="mt-4" />
        </div>
    );
};

export default LoginForm;