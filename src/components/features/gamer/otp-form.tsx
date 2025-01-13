"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useTranslations } from "next-intl";

const createOtpFormSchema = (t: any) => z.object({
    otp: z.string().length(4, { message: t('validation.otp-length') }),
});

export type OTPFormValues = z.infer<ReturnType<typeof createOtpFormSchema>>;

type Props = {
    defaultValues?: OTPFormValues;
    onSubmit: (data: OTPFormValues) => void;
    isLoading?: boolean;
    resendOTP: () => void;
    onBack?: () => void;
};

const OTPForm = ({ defaultValues, onSubmit, isLoading, resendOTP }: Props) => {
    const t = useTranslations('otpVerification');

    const form = useForm<OTPFormValues>({
        resolver: zodResolver(createOtpFormSchema(t)),
        defaultValues,
    });

    const otp = form.watch("otp");

    return (
        <div className="w-full max-w-sm">
            <header className="mb-10 text-center space-y-2">
                <h1 className="text-3xl font-semibold text-white">
                    {t('title')}
                </h1>
                <p className="text-[#F9F9F9B2]">
                    {t('description')}
                </p>
            </header>

            <FormProvider
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div className="mt-8 mx-auto">
                    <InputOTP
                        maxLength={4}
                        value={otp}
                        onChange={(value) => form.setValue("otp", value)}
                    >
                        <InputOTPGroup className="flex gap-4 justify-center mx-auto">
                            {[0, 1, 2, 3].map((index) => (
                                <InputOTPSlot
                                    key={index}
                                    className="md:w-16 md:h-16 w-12 h-12 rounded-lg bg-[#182B5A] border-[#EFF8FF17] text-white text-2xl focus:border-[#55B0FF] focus:ring-[#55B0FF] focus:ring-opacity-50"
                                    index={index}
                                />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>
                    {form.formState.errors.otp && (
                        <p className="text-red-500 text-sm text-center mt-2">
                            {form.formState.errors.otp.message}
                        </p>
                    )}
                </div>

                <footer className="flex justify-end flex-col gap-8">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full mt-8"
                        disabled={isLoading}
                    >
                        {isLoading ? t('buttons.verifying') : t('buttons.verify')}
                    </Button>
                </footer>
            </FormProvider>
            
            <Button 
                variant="ghost" 
                onClick={resendOTP} 
                className="w-full mt-8 text-white hover:bg-white/10 hover:text-white"
            >
                {t('buttons.resend')}
            </Button>
        </div>
    );
};

export default OTPForm;