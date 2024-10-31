"use client";
import LoadingScreen from "@/components/common/loading-screen";
import PaymentTable from "@/components/features/payments/payment-table";
import UserCard from "@/components/features/user/user-card"; // Assuming you have a UserCard component
import { Separator } from "@/components/ui/separator";
import { User } from "@/models/user"; // Assuming you have a User model
import { useGetUserById } from "@/react-query/user-query"; // Custom hook for fetching user details
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewUserPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetUserById(id.toString()); // Fetch user data by ID

    const userDetails = useMemo(() => {
        if (isSuccess) {
            const userItem = new User(data?.data.data.userDetails); // Assuming userDetails is the correct data path
            return userItem;
        }
        return null;
    }, [data, isSuccess]);

    if (isLoading && userDetails) return <LoadingScreen>Loading user...</LoadingScreen>; // Show loading screen if loading

    return (
        <section className="container-main min-h-[60vh]">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">User Details</h2>
            </header>
            <Separator className="mt-4" />
            <main className="mt-4">
                {userDetails && <UserCard user={userDetails} />} {/* Render UserCard if data exists */}
            </main>

            <main className="mt-4">
                <PaymentTable userId={userDetails?.id} />
            </main>
        </section>
    );
};

export default ViewUserPage;
