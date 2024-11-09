import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import FormPassword from "@/components/ui/form/form-password";
import Link from "next/link";

// Zod schema for validating the login form fields
export const createLoginSchema = z.object({
    phone: z
        .string()
        .nonempty("Phone number is required")
        .regex(
            /^\+?[1-9]\d{1,14}$/,
            "Invalid phone number format. Include country code, e.g., +1234567890"
        ),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters")
        .nonempty("Password is required"),
});

export type LoginFormValues = z.infer<typeof createLoginSchema>;

type Props = {
    defaultValues?: LoginFormValues;
    onSubmit: (data: LoginFormValues) => void;
    onForgotPassword: () => void;
    isLoading?: boolean;
};

const LoginForm = ({ defaultValues, onSubmit, onForgotPassword, isLoading }: Props) => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(createLoginSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 font-semibold text-white">Welcome Back</h1>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                {/* Phone Field */}
                <FormInput
                    control={control}
                    game
                    name="phone"
                    label="Phone Number*"
                    required
                />

                {/* Password Field */}
                <div className="space-y-2">
                    <FormPassword
                        control={control}
                        game
                        name="password"
                        type="password"
                        label="Password*"
                        required
                    />

                </div>

                <footer className="flex justify-end flex-col gap-2 mt-12">

                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </footer>

                <div className="flex items-center justify-center gap-3 text-white">
                    <Separator className="my-6 flex-1 bg-white/20" />
                    <span>Or</span>
                    <Separator className="my-6 flex-1 bg-white/20" />
                </div>

                <Button
                    size="lg"
                    variant="secondary"
                    className="w-full bg-[#182B5A] border-[#EFF8FF17] text-white"
                >
                    <img
                        className="mr-2 size-5"
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
                        alt="Google logo"
                    />
                    Continue with Google
                </Button>

                <div className="mt-8 ">

                    <Link href="/game/auth/register" className="text-white">
                        <Button variant="ghost" fullWidth>
                            Create an Account
                        </Button>
                    </Link>
                </div>
            </FormProvider>
        </div>
    );
};

export default LoginForm;