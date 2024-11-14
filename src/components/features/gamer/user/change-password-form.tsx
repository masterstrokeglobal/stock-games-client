import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { usePasswordChange } from "@/react-query/user-queries";
import { useAuthStore } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for password change
const passwordChangeSchema = z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmNewPassword"]
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const PasswordChangeForm = () => {
    const { userDetails: user } = useAuthStore();
    const { mutate: changePassword, isPending: isChanging } = usePasswordChange();

    const form = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        }
    });

    const { control, handleSubmit } = form;

    const onSubmit = async (data: PasswordChangeFormValues) => {
        if (!user?.id) return;

        changePassword(
            {
                userId: user.id.toString(),
                updateData: {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                }
            },
            {
                onSuccess: () => {
                    form.reset();
                },
                onError: (error) => {
                    console.error('Password change failed:', error);
                }
            }
        );
    };

    return (
        <div className="w-full max-w-xl flex-1 flex ">

            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 pb-4 flex justify-between flex-col w-full">
                <div className="space-y-4 ">
                    <FormInput
                        control={control}
                        game
                        name="oldPassword"
                        label="Old Password*"
                        type="password"
                        required
                    />

                    <FormInput
                        control={control}
                        game
                        name="newPassword"
                        label="New Password*"
                        type="password"
                        required
                    />

                    <FormInput
                        control={control}
                        game
                        name="confirmNewPassword"
                        label="Re-enter New Password*"
                        type="password"
                        required
                    />
                </div>

                <footer className="flex mt-auto justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isChanging}
                    >
                        {isChanging ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Changing...
                            </>
                        ) : 'Change Password'}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default PasswordChangeForm;