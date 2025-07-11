import { Button } from "@/components/ui/button";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import { useAuthStore } from "@/context/auth-context";
import { usePasswordChange } from "@/react-query/user-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

const PasswordChangeForm = () => {
    const t = useTranslations('password');
    const { userDetails: user } = useAuthStore();
    const { mutate: changePassword, isPending: isChanging } = usePasswordChange();
    const router = useRouter();

    // Zod schema with translations
    const passwordChangeSchema = z.object({
        oldPassword: z.string().min(8, t('oldPassword.validation.minLength')),
        newPassword: z.string().min(8, t('newPassword.validation.minLength')),
        confirmNewPassword: z.string().min(8, t('confirmPassword.validation.minLength')),
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: t('confirmPassword.validation.match'),
        path: ["confirmNewPassword"]
    });

    type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

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
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => {
                    form.reset();
                    router.push('/game/platform/user-menu');
                }
            }
        );
    };

    return (
        <div className="w-full max-w-3xl flex-1 flex">
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 pb-4 flex justify-between flex-col w-full">
                <div className="space-y-4">
                    <FormPassword
                        control={control}
                        game
                        name="oldPassword"
                        label={t('oldPassword.label')}
                        type="password"
                        required
                    />

                    <FormPassword
                        control={control}
                        game
                        name="newPassword"
                        label={t('newPassword.label')}
                        type="password"
                        required
                    />

                    <FormPassword
                        control={control}
                        game
                        name="confirmNewPassword"
                        label={t('confirmPassword.label')}
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
                                {t('button.loading')}
                            </>
                        ) : t('button.submit')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default PasswordChangeForm;