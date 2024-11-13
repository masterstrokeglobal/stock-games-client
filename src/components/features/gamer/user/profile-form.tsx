import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useGameUserProfile, useGameUserUpdateById } from "@/react-query/game-user-queries";
import { useAuthStore } from "@/context/auth-context";

// Zod schema for profile update
const updateProfileSchema = z.object({
    firstname: z.string().min(1, "First name is required").max(50),
    lastname: z.string().min(1, "Last name is required").max(50),
    username: z.string().max(100),
    phone: z.string(),
    email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

const ProfileUpdateForm = () => {
    const { userDetails: user } = useAuthStore();
    const { mutate: updateProfile, isPending: isUpdating } = useGameUserUpdateById();
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError,
        error: profileError
    } = useGameUserProfile();

    // Form initialization with react-hook-form
    const form = useForm<ProfileFormValues>({
        defaultValues: {
            firstname: '',
            lastname: '',
            username: '',
            phone: '',
            email: '',
        },
    });

    // Update form values when profile data is loaded
    React.useEffect(() => {
        if (profileData?.data) {
            const profile = profileData.data;
            form.reset({
                firstname: profile.firstname,
                lastname: profile.lastname,
                username: profile.username,
                phone: profile.phone,
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
                    email: data.email,
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
                    <FormInput
                        control={control}
                        game
                        name="firstname"
                        label="First Name*"
                        required
                    />
                    <FormInput
                        control={control}
                        game
                        name="lastname"
                        label="Last Name*"
                        required
                    />
                </div>

                <FormInput
                    control={control}
                    game
                    name="username"
                    label="Username"
                />

                <FormInput
                    control={control}
                    game
                    name="phone"
                    label="Phone Number"
                    disabled
                />

                <FormInput
                    control={control}
                    game
                    name="email"
                    label="Email*"
                    type="email"
                    required
                />

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
                                Updating...
                            </>
                        ) : 'Update Profile'}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default ProfileUpdateForm;