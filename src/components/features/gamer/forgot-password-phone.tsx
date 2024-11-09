import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for validating international phone numbers
export const createPhoneNumberSchema = z.object({
    phoneNumber: z
        .string()
        .nonempty("Phone number is required")
        .regex(
            /^\+?[1-9]\d{1,14}$/,
            "Invalid phone number format. Include country code, e.g., +1234567890"
        ),
});

export type PhoneNumberFormValues = z.infer<typeof createPhoneNumberSchema>;

type Props = {
    defaultValues?: PhoneNumberFormValues;
    onSubmit: (data: PhoneNumberFormValues) => void;
    isLoading?: boolean;
    onBack?: () => void;
};

const PhoneNumberForm = ({
    defaultValues,
    onSubmit,
    isLoading,
    onBack,
}: Props) => {
    const form = useForm({
        resolver: zodResolver(createPhoneNumberSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="md:text-center mb-6">
                    <h2 className="text-2xl font-bold">Forgot Password</h2>
                    <p className="text-gray-600">
                        Enter your phone number to reset your password. Include your country code.
                    </p>
                </div>

                {/* Phone Number Field */}
                <FormInput
                    control={control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="e.g., +1234567890"
                    type="tel"
                />

                {/* Submit Button */}
                <div className="mt-6">
                    <Button type="submit" disabled={isLoading} fullWidth>
                        {isLoading ? "Processing..." : "Submit"}
                    </Button>
                </div>

                {/* Back Button (Optional) */}
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Back
                    </button>
                )}
            </form>
        </FormProvider>
    );
};

export default PhoneNumberForm;

