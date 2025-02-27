"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import PasswordChangeForm from "@/components/features/gamer/user/change-password-form";
import { useTranslations } from "next-intl";

const UserProfilePage = () => {
    const t = useTranslations('password');

    return (
        <Container className="bg-secondary-game w-fit rounded-xl flex flex-col gap-12 pt-24 items-center min-h-screen">
            <TopBar>
                <span>{t('title')}</span>
            </TopBar>
            <PasswordChangeForm />
        </Container>
    );
};

export default UserProfilePage;