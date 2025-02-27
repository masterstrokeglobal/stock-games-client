"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import ProfileUpdateForm from "@/components/features/gamer/user/profile-form";
import { useTranslations } from "next-intl";

const UserProfilePage = () => {
    const t = useTranslations('profile');

    return (
        <Container className="bg-secondary-game w-fit rounded-xl pt-24 flex flex-col gap-12 items-center min-h-screen ">
            <TopBar>
                <span>{t('page-title')}</span>
            </TopBar>
            <ProfileUpdateForm showReferenceCode={false} />
        </Container>
    );
};


export default UserProfilePage;