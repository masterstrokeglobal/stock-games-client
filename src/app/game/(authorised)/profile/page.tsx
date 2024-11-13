"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import ProfileUpdateForm from "@/components/features/gamer/user/profile-form";

const UserProfilePage = () => {
    return (
        <Container className="bg-primary-game pt-24 flex flex-col gap-12 items-center min-h-screen ">
            <TopBar>
                <span>
                    Your Info
                </span>
            </TopBar>
            <ProfileUpdateForm />
        </Container>
    );
};

export default UserProfilePage;