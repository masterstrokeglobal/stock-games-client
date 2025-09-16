"use client";

import LoadingScreen from "@/components/common/loading-screen";
import UserCard from "@/components/features/user/user-card";
import TransactionTable from "@/components/features/transaction/transaction-table";
import BettingHistory from "@/components/features/betting-history/betting-history";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useGetUserById } from "@/react-query/user-queries";

const OperatorViewUserPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id?.toString();

  const { data: userDetails, isLoading } = useGetUserById(userId);

  if (isLoading) return <LoadingScreen className="h-[60vh]">Loading user...</LoadingScreen>;

  if (!userDetails) {
    return (
      <section className="container-main min-h-[60vh]">
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-xl font-semibold">User Details</h2>
          <Button variant="secondary" onClick={() => router.back()}>Go back</Button>
        </div>
        <Separator className="mt-4" />
        <div className="mt-10 text-muted-foreground">User not found.</div>
      </section>
    );
  }

  return (
    <section className="container-main min-h-[60vh]">
      <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between mt-6">
        <h2 className="text-xl font-semibold">User Details</h2>
        <Button variant="secondary" onClick={() => router.back()}>Go back</Button>
      </header>
      <Separator className="mt-4" />
      <main className="mt-4">
        <UserCard user={userDetails.data} />
      </main>

      <main className="mt-8">
        <TransactionTable className="min-h-0" userId={userId} />
      </main>

      <main className="mt-8">
        <BettingHistory userId={userId} />
      </main>
    </section>
  );
};

export default OperatorViewUserPage;


