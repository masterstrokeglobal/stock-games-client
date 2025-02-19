import { Button } from "@/components/ui/button";
import FormPassword from '@/components/ui/form/form-password';
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Simple password validation schema
const changePasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordChangeFormValues = z.infer<typeof changePasswordSchema>;

type Props = {
    onSubmit: (data: PasswordChangeFormValues) => void;
    isLoading?: boolean;
};

const PasswordChangeForm = ({ onSubmit, isLoading }: Props) => {
    const form = useForm<PasswordChangeFormValues>({
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        },
        resolver: zodResolver(changePasswordSchema),
    });

    const handleSubmit = (data: PasswordChangeFormValues) => {
        onSubmit(data);
    };

    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormPassword
                    control={form.control}
                    name="newPassword"
                    label="New Password*"
                />
                <FormPassword
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm New Password*"
                />
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Changing..." : "Change Password"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default PasswordChangeForm;