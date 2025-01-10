"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import PasswordChangeForm from "@/components/features/gamer/user/change-password-form";

const UserProfilePage = () => {
    return (
        <Container className="bg-primary-game  flex flex-col gap-12 pt-24 items-center min-h-screen ">
            <TopBar>
                <span>
                    Change Password
                </span>
            </TopBar>
            <PasswordChangeForm />
        </Container>
    );
};

export default UserProfilePage;