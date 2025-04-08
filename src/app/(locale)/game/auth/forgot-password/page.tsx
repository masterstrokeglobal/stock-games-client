"use client";
import {
    StepperProvider,
    useStepper
} from "@/context/stepper-context";
import { useForgotChangePassword, useForgotPasswordEmail, useVerifyForgotPassword } from "@/react-query/game-user-queries";
import { useRouter } from "next/navigation";
import React from 'react';

import ResetPasswordForm, { ResetPasswordFormValues } from "@/components/features/gamer/forgot-password";
import ForgotPasswordEmailForm, { ForgotPasswordFormValues } from '@/components/features/gamer/forgot-password-email';
import OTPForm from "@/components/features/gamer/otp-form";
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
    const [user, setUser] = React.useState<number | null>(null);
    const [email, setEmail] = React.useState<string | null>(null);
    const { currentStep, nextStep } = useStepper();
    const { mutate: loginUser, isPending } = useForgotPasswordEmail();
    const {
        mutate: changePassword,
        isPending: isChangePasswordPending,
    } = useForgotChangePassword();
    const {
        mutate: verifyUser,
        isPending: isVerifyPending,

    } = useVerifyForgotPassword();
    const router = useRouter();

    const handleForgotPassword = (data: ForgotPasswordFormValues) => {
        setEmail(data.email);
        loginUser(data, {
            onSuccess: (response) => {
                const user = response.data?.user;
                if (user) {
                    setUser(user);
                }
                nextStep();
            }
        });
    };

    const handleResendOTP = () => {

        if (email == null) return toast.error("Email not found");
        loginUser({
            email: email
        }, {
            onSuccess: (response) => {
                const user = response.data?.user;
                if (user) {
                    setUser(user);
                }
            }
        });
    };




    const handlePasswordReset = (passwordData: ResetPasswordFormValues) => {
        if (user == null) return toast.error("User not found");

        changePassword({
            password: passwordData.password,
            userId: user.toString()
        }, {
            onSuccess: () => {
                router.push("/game/platform");
            }
        });
    };

    const handleOTPSubmit = (otpData: { otp: string }) => {
        if (user == null) return toast.error("User not found");

        verifyUser({
            otp: otpData.otp,
            userId: user.toString()
        }, {
            onSuccess: () => {
                nextStep();
            }
        });
    };


    switch (currentStep) {
        case 1:
            return (
                <ForgotPasswordEmailForm
                    isLoading={isPending}
                    onSubmit={handleForgotPassword}
                />
            );

        case 2:
            return (
                <OTPForm
                    resendOTP={handleResendOTP}
                    onSubmit={handleOTPSubmit}
                    isLoading={isVerifyPending || isPending}
                />
            );
        case 3:
            return (
                <ResetPasswordForm
                    onSubmit={handlePasswordReset}
                    isLoading={isChangePasswordPending}
                />
            );


        default:
            return null;
    }
};

const ForgotPasswordStepper = () => {
    return (
        <StepperProvider initialStep={1}>
            <RegisterPage />
        </StepperProvider>
    );
};

export default ForgotPasswordStepper;