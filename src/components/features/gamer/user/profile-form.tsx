import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import { useGameUserProfile, useGameUserUpdateById } from "@/react-query/game-user-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// ProfileUpdateForm Component
const updateProfileSchema = (t: any) =>
    z.object({
        firstname: z.string().min(1, t('validation.firstname-required')).max(50, t('validation.firstname-max')),
        lastname: z.string().min(1, t('validation.lastname-required')).max(50, t('validation.lastname-max')),
        username: z.string().max(100, t('validation.username-max')),
        phone: z.string().or(z.null()),
        email: z.string().email(t('validation.email-invalid')).or(z.literal("").transform(() => null)),
        referenceCode: z.string().optional(),
        profileImage: z.string().url().optional(),
    }).refine(
        (data) => {
            // Accept if at least one of phone or email is present and valid
            const hasPhone = !!(data.phone && typeof data.phone === "string" && data.phone.trim() !== "");
            const hasEmail = !!(data.email && typeof data.email === "string" && data.email.trim() !== "");
            return hasPhone || hasEmail;
        },
        {
            message: t('validation.phone-or-email-required'),
            path: ['phone'],
        }
    ).refine(
        (data) => {
            const hasPhone = !!(data.phone && typeof data.phone === "string" && data.phone.trim() !== "");
            const hasEmail = !!(data.email && typeof data.email === "string" && data.email.trim() !== "");
            return hasPhone || hasEmail;
        },
        {
            message: t('validation.phone-or-email-required'),
            path: ['email'],
        }
    );

type ProfileFormValues = z.infer<ReturnType<typeof updateProfileSchema>>;

type Props = {
    showReferenceCode: boolean
}

const ProfileUpdateForm = ({ showReferenceCode }: Props) => {
    const t = useTranslations('profile');
    const { userDetails: user, userDetails } = useAuthStore();
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

    const isDemoUser = (userDetails as User).isDemoUser;
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
                        disabled={isDemoUser}
                        name="profileImage"
                        label={t('labels.profile-image')}
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput
                        control={control}
                        game
                        disabled={isDemoUser}
                        name="firstname"
                        label={t('labels.firstname')}
                        required
                    />
                    <FormInput
                        control={control}
                        game
                        disabled={isDemoUser}
                        name="lastname"
                        label={t('labels.lastname')}
                        required
                    />
                </div>

                <FormInput
                    control={control}
                    game
                    disabled={isDemoUser}
                    name="username"
                    label={t('labels.username')}
                />

                <FormInput
                    control={control}
                    game
                    disabled
                    name="phone"
                    label={t('labels.phone')}
                />

                <FormInput
                    control={control}
                    game
                    disabled
                    name="email"
                    label={t('labels.email')}
                    type="email"
                />

                {showReferenceCode && (
                    <FormInput
                        control={control}
                        game
                        disabled={isDemoUser}
                        name="referenceCode"
                        label={t('labels.reference-code')}
                        type="text"
                    />
                )}

                <footer className="flex justify-end mt-8">
                    <Button
                        type="submit"
                        size="lg"
                        variant="platform-gradient-secondary"
                        className="w-full rounded-none"
                        disabled={isUpdating || isLoadingProfile || isDemoUser}
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