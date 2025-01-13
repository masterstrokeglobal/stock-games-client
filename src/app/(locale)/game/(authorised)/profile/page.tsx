"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import ProfileUpdateForm from "@/components/features/gamer/user/profile-form";
import { useGameUserProfile } from "@/react-query/game-user-queries";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const UserProfilePage = () => {
    const t = useTranslations('profile');
    const { data, isSuccess } = useGameUserProfile();

    const hasAgent = useMemo(() => {
        const user = data?.data;
        return Boolean(user.agent);
    }, [data, isSuccess]);

    return (
        <Container className="bg-primary-game pt-24 flex flex-col gap-12 items-center min-h-screen ">
            <TopBar>
                <span>{t('page-title')}</span>
            </TopBar>
            <ProfileUpdateForm showReferenceCode={false} />
        </Container>
    );
};


export default UserProfilePage;