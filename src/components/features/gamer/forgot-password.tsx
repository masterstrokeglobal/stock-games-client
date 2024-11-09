import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for validating the reset password form fields
export const createResetPasswordSchema = z.object({
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters")
        .nonempty("Password is required"),
    confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters")
        .nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof createResetPasswordSchema>;

type Props = {
    defaultValues?: ResetPasswordFormValues;
    onSubmit: (data: ResetPasswordFormValues) => void;
    isLoading?: boolean;
    onBack?: () => void;
};

const ResetPasswordForm = ({ defaultValues, onSubmit, isLoading, onBack }: Props) => {
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(createResetPasswordSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <div className="space-y-2 md:text-center mb-10">
                <h1 className="text-3xl font-semibold text-white">Forgot Password</h1>
                <p className="text-sm text-[#F9F9F9B2]">
                    Enter your new password twice below to reset a new password.                </p>
            </div>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                {/* Password Fields */}
                <FormInput
                    control={control}
                    game
                    name="password"
                    type="password"
                    label="Enter new password*"
                    required
                />

                <FormInput
                    control={control}
                    game
                    name="confirmPassword"
                    type="password"
                    label="Re-enter new password*"
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
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default ResetPasswordForm;