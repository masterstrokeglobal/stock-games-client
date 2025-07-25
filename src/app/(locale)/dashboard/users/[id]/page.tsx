"use client";

import LoadingScreen from "@/components/common/loading-screen";
import UpdateAgentBonusPercentageForm from "@/components/common/update-agent-bonus-percentage";
import BettingHistory from "@/components/features/betting-history/betting-history";
import TransactionTable from "@/components/features/transaction/transaction-table";
import PlacementManagement from "@/components/features/user/placement-allowed";
import UserCard from "@/components/features/user/user-card";
import UserEarningsCard from "@/components/features/user/user-earning";
import UserUpdateNote from "@/components/features/user/user-update-note";
import UserUpdateWithdrawl from "@/components/features/user/user-update-withdrawl";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import User from "@/models/user";
import { useGameUserUpdateById } from "@/react-query/game-user-queries";
import { useGetUserById } from "@/react-query/user-queries";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewUserPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetUserById(id.toString());
    const { mutate, isPending } = useGameUserUpdateById();
    const { userDetails: currentUser } = useAuthStore();

    const updateUserBonusPercentage = (data: { depositBonusPercentage: number }) => {
        mutate({ updateData: data, userId: id.toString() });
    };



    const userDetails = useMemo(() => {
        if (isSuccess) {
            return new User(data?.data); // Assuming userDetails is the correct data path
        }
        return null;
    }, [data, isSuccess]);

    const user = currentUser as Admin;

    const isAdmin = user.role === AdminRole.COMPANY_ADMIN || user.role === AdminRole.SUPER_ADMIN;

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

            {isAdmin && userDetails && <main className="mt-4">
                <UserUpdateNote user={userDetails} />
            </main>}

            {(!user.isAgent && userDetails) && <main className="mt-4" >
                <PlacementManagement user={userDetails} />
            </main>}

            {isAdmin && userDetails && <main className="mt-4">
                <UserUpdateWithdrawl user={userDetails} />
            </main>}


            {(!user.isAgent && userDetails && userDetails.company?.depositBonusPercentageEnabled) && <UpdateAgentBonusPercentageForm defaultValues={{ depositBonusPercentage: userDetails.depositBonusPercentage }} onSubmit={updateUserBonusPercentage} isLoading={isPending} />}
            <UserEarningsCard userId={id.toString()} /> {/* Render UserEarningsCard with user ID */}

            {user?.role != AdminRole.AGENT && <main className="mt-4">
                <TransactionTable className="min-h-0" userId={id.toString()} /> {/* Render TransactionTable with user ID */}
            </main>}

            {user?.role !== AdminRole.AGENT && <main className="mt-4">
                <BettingHistory userId={id.toString()} />
            </main>}
        </section>
    );
};

export default ViewUserPage;
