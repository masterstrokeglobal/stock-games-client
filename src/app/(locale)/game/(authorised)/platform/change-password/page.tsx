"use client";
import PasswordChangeForm from "@/components/features/gamer/user/change-password-form";
import { useTranslations } from "next-intl";

const UserProfilePage = () => {
    const t = useTranslations('password');

    return (
        <section className="w-full max-w-3xl mx-auto min-h-[calc(100vh-200px)] flex flex-col gap-4">
            <header className="flex flex-col gap-2 mb-4">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
            </header>
            <PasswordChangeForm />
        </section>
    );
};

export default UserProfilePage;