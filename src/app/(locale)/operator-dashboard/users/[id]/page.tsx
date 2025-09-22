"use client";

import LoadingScreen from "@/components/common/loading-screen";
import RoleProtection from "@/components/common/role-protection";
import { OperatorRole } from "@/models/operator";
import BettingHistory from "@/components/features/betting-history/betting-history";
import TransactionTable from "@/components/features/transaction/transaction-table";
import UserCard from "@/components/features/user/user-card";
import UserEarningsCard from "@/components/features/user/user-earning";
import { Separator } from "@/components/ui/separator";
import { useGetUserById } from "@/react-query/user-queries";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import User from "@/models/user";

const OperatorViewUserPage = () => {
    const params = useParams();
    const { id } = params as { id: string };

    const { data, isLoading, isSuccess } = useGetUserById(id.toString());

    const userDetails = useMemo(() => {
        if (isSuccess) {
            return new User(data?.data);
        }
        return null;
    }, [data, isSuccess]);

    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading user...</LoadingScreen>;

    return (
        <RoleProtection allowedRoles={[OperatorRole.OPERATOR, OperatorRole.AGENT, OperatorRole.MASTER, OperatorRole.DUPER_MASTER, OperatorRole.SUPER_DUPER_MASTER]} redirectTo="/operator-dashboard">
            <section className="container-main min-h-[60vh]">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">User Details</h2>
                </header>
                <Separator className="mt-4" />

                <main className="mt-4">
                    {userDetails && <UserCard user={userDetails} />}
                </main>

                <UserEarningsCard userId={id.toString()} />

                <main className="mt-4">
                    <TransactionTable className="min-h-0" userId={id.toString()} />
                </main>

                <main className="mt-4">
                    <BettingHistory userId={id.toString()} />
                </main>
            </section>
        </RoleProtection>
    );
};

export default OperatorViewUserPage;
