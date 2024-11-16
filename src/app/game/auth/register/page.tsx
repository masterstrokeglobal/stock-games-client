'use client';
import OTPForm, { OTPFormValues } from "@/components/features/gamer/otp-form";
import RegisterForm, { RegisterFormValues } from "@/components/features/gamer/register-form";
import { useAuthStore } from "@/context/auth-context";
import { StepperProvider, useStepper } from "@/context/stepper-context";
import User from "@/models/user";
import { useGameUserRegister, useGameUserResendOTP, useGameUserVerify } from "@/react-query/game-user-queries";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
    const { currentStep, nextStep } = useStepper();
    const [userId, setUserId] = useState<string | null>(null);
    const { userDetails } = useAuthStore();
    const router = useRouter();

    const { mutate, isPending } = useGameUserRegister();
    const { mutate: resendOTP } = useGameUserResendOTP();

    const { mutate: verifyUser, isPending: isLoading } = useGameUserVerify();

    const registerUser = (data: RegisterFormValues) => {

        const firstname = data.name.split(" ")[0];
        const lastname = data.name.split(" ")[1];

        mutate({
            firstname,
            lastname,
            username: data.username,
            phone: data.phone,
            email: data.email,
            password: data.password,
            companyId: 4,
        }, {
            onSuccess: (data) => {
                const user = new User(data.data);
                setUserId(user.id?.toString() ?? null);
                if (!user.isVerified)
                    nextStep();
            }
        });
    }

    const verifyOTP = (data: OTPFormValues) => {
        verifyUser({
            userId: userDetails?.id?.toString() ?? "",
            verificationData: {
                otp: data.otp
            }
        }, {
            onSuccess: () => {
                router.push("/game/auth/login");
            }
        });
    }

    const resend = () => {
        resendOTP({
            userId: userId ?? ""
        }
        );
    };


    if (currentStep === 1) {
        return <RegisterForm isLoading={isPending} onSubmit={registerUser} />
    }

    if (currentStep === 2) {
        return <OTPForm resendOTP={resend} isLoading={isLoading} onSubmit={verifyOTP} />
    }

};


const Stepper = () => {
    return <StepperProvider initialStep={1}>
        <RegisterPage />
    </StepperProvider>
}


export default Stepper;