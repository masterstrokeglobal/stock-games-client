'use client';
import ResetPasswordForm from "@/components/features/gamer/forgot-password";
import LoginForm, { LoginFormValues } from "@/components/features/gamer/login-form";
import OTPForm from "@/components/features/gamer/otp-form";
import { StepperProvider, useStepper } from "@/context/stepper-context";
import { useGameUserLogin } from "@/react-query/game-user-queries";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const { currentStep, nextStep } = useStepper();
    const { mutate } = useGameUserLogin();
    const router = useRouter();

    const loginUser = (data: LoginFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/game");
            }
        });
    }

    const onForgotPassword = () => {
        nextStep();
    }

    if (currentStep === 1) {
        return <LoginForm
            onSubmit={loginUser}
            onForgotPassword={onForgotPassword}
        />
    }

    if (currentStep === 2) {
        return <ResetPasswordForm onSubmit={function (): void {
            throw new Error("Function not implemented.");
        }} />
    }

    if (currentStep === 3) {
        return <OTPForm onSubmit={function (): void {
            throw new Error("Function not implemented.");
        }} />
    }

};


const Stepper = () => {
    return <StepperProvider initialStep={1}>
        <RegisterPage />
    </StepperProvider>
}


export default Stepper;