import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useGameUserProfile, useGameUserUpdateById } from "@/react-query/game-user-queries";
import { useAuthStore } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import FormImage from "@/components/ui/form/form-image";
import { useTranslations } from "next-intl";
// ProfileUpdateForm Component
const updateProfileSchema = (t: any) => z.object({
    firstname: z.string().min(1, t('validation.firstname-required')).max(50, t('validation.firstname-max')),
    lastname: z.string().min(1, t('validation.lastname-required')).max(50, t('validation.lastname-max')),
    username: z.string().max(100, t('validation.username-max')),
    phone: z.string().optional(),
    email: z.string().email(t('validation.email-invalid')),
    referenceCode: z.string().optional(),
    profileImage: z.string().url().optional(),
});

type ProfileFormValues = z.infer<ReturnType<typeof updateProfileSchema>>;

type Props = {
    showReferenceCode: boolean
}

const ProfileUpdateForm = ({ showReferenceCode }: Props) => {
    const t = useTranslations('profile');
    const { userDetails: user } = useAuthStore();
    const { mutate: updateProfile, isPending: isUpdating } = useGameUserUpdateById();
    const {
        data: profileData,
        isLoading: isLoadingProfile,
    } = useGameUserProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(updateProfileSchema(t)),
        defaultValues: {
            firstname: '',
            lastname: '',
            username: '',
            phone: '',
            email: '',
        },
    });

    React.useEffect(() => {
        if (profileData?.data) {
            const profile = profileData.data;
            form.reset({
                firstname: profile.firstname,
                lastname: profile.lastname,
                username: profile.username,
                phone: profile.phone,
                profileImage: profile.profileImage,
                email: profile.email,
            });
        }
    }, [profileData, form]);

    const { control, handleSubmit } = form;

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user?.id) return;

        updateProfile(
            {
                userId: user.id.toString(),
                updateData: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    username: data.username,
                    profileImage: data.profileImage,
                },
            }
        );
    };

    if (isLoadingProfile) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm">
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <FormImage 
                        control={control} 
                        name="profileImage" 
                        label={t('labels.profile-image')} 
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput
                        control={control}
                        game
                        name="firstname"
                        label={t('labels.firstname')}
                        required
                    />
                    <FormInput
                        control={control}
                        game
                        name="lastname"
                        label={t('labels.lastname')}
                        required
                    />
                </div>

                <FormInput
                    control={control}
                    game
                    name="username"
                    label={t('labels.username')}
                />

                <FormInput
                    control={control}
                    game
                    name="phone"
                    disabled
                    label={t('labels.phone')}
                />

                <FormInput
                    control={control}
                    game
                    name="email"
                    label={t('labels.email')}
                    type="email"
                    disabled
                />

                {showReferenceCode && (
                    <FormInput 
                        control={control} 
                        game 
                        name="referenceCode" 
                        label={t('labels.reference-code')} 
                        type="text" 
                        disabled 
                    />
                )}

                <footer className="flex justify-end mt-8">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isUpdating || isLoadingProfile}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('buttons.updating')}
                            </>
                        ) : t('buttons.update-profile')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};
export default ProfileUpdateForm;