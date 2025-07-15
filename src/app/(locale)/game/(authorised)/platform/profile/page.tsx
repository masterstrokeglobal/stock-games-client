"use client";
import ProfileUpdateForm from "@/components/features/gamer/user/profile-form";

const UserProfilePage = () => {

    return (
        <section className="w-full max-w-3xl mx-auto flex justify-center">
            <ProfileUpdateForm showReferenceCode={false}  />
        </section>
    );
};


export default UserProfilePage;