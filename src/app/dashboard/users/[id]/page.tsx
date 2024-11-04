"use client";

import LoadingScreen from "@/components/common/loading-screen";
import UserCard from "@/components/features/user/user-card"; // Assuming you have a UserCard component
import { Separator } from "@/components/ui/separator";
import User from "@/models/user"; // Assuming you have a User model
import { useGetUserById } from "@/react-query/user-queries"; // Custom hook for fetching user details
import { useParams } from "next/navigation";
import { useMemo } from "react";
import TransactionTable from "@/components/features/transaction/transaction-table"; // Adjust the import based on your transaction table component

const ViewUserPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetUserById(id.toString()); // Fetch user data by ID

    const userDetails = useMemo(() => {
        if (isSuccess) {
            return new User(data?.data); // Assuming userDetails is the correct data path
        }
        return null;
    }, [data, isSuccess]);

    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading user...</LoadingScreen>; // Show loading screen if loading

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
                <TransactionTable userId={userDetails?.id?.toString()} /> {/* Render TransactionTable with user ID */}
            </main>
        </section>
    );
};

export default ViewUserPage;
