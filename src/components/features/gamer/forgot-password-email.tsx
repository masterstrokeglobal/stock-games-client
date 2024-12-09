import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";

// Zod schema for validating the email input
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .nonempty("Email is required")
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type Props = {
    onSubmit: (data: ForgotPasswordFormValues) => void;
    isLoading?: boolean;
};

const ForgotPasswordEmailForm: React.FC<Props> = ({ 
    onSubmit, 
    isLoading 
}) => {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 font-semibold text-white">
                Forgot Password
            </h1>

            <p className="text-center text-white/70 mb-6">
                Enter the email address associated with your account
            </p>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormInput
                    control={control}
                    game
                    name="email"
                    label="Email Address*"
                    type="email"
                    required
                />

                <Button
                    type="submit"
                    size="lg"
                    variant="game"
                    className="w-full mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
            </FormProvider>
        </div>
    );
};

export default ForgotPasswordEmailForm;