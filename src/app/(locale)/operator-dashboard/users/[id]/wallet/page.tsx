"use client";

import LoadingScreen from "@/components/common/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useGetUserWallet } from "@/react-query/user-queries";
import { RefreshCw, Wallet } from "lucide-react";
import { useMemo } from "react";
import FormProvider from "@/components/ui/form/form-provider";
import FormInput from "@/components/ui/form/form-input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAgentDepositToUser, useGetCurrentOperator, useRedeemFromUser } from "@/react-query/operator-queries";
import { OperatorRole } from "@/models/operator";
import { toast } from "sonner";

const OperatorUserWalletPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id?.toString();

  const { data, isLoading, refetch, isRefetching } = useGetUserWallet(userId);
  const { data: currentOperator } = useGetCurrentOperator();
  const { mutateAsync: agentDepositToUser, isPending: isAgentRechargePending } = useAgentDepositToUser();
  // const { mutateAsync: masterDepositToUser, isPending: isMasterRechargePending } = useMasterDepositToUser();
  const { mutateAsync: redeemFromUser, isPending: isWithdrawPending } = useRedeemFromUser();

  const wallet = useMemo(() => {
    // API returns axios response; unwrap common shapes
    const payload = (data as any)?.data || data;
    return payload?.wallet || payload; // support {wallet: {...}} or direct
  }, [data]);

  if (isLoading) return <LoadingScreen className="h-[60vh]" />;

  return (
    <section className="container-main max-w-4xl mx-auto py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Wallet</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.back()}>Go back</Button>
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={"h-4 w-4 mr-2 " + (isRefetching ? "animate-spin" : "")} />
            Refresh
          </Button>
        </div>
      </header>
      <Separator />

      <main className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="mt-1 text-2xl font-bold">₹{(wallet?.mainBalance ?? wallet?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
              {wallet?.bonusBalance !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Bonus Balance</span>
                  <span className="font-medium">₹{Number(wallet?.bonusBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {wallet?.wagerAmount !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Wager Amount</span>
                  <span className="font-medium">₹{Number(wallet?.wagerAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {currentOperator?.role === OperatorRole.AGENT && (
          <Card>
            <CardHeader>
              <CardTitle>Recharge User</CardTitle>
            </CardHeader>
            <CardContent>
              <RechargeForm
                onSubmit={async (amount) => {
                  try {
                    await agentDepositToUser({ userId, amount });
                    toast.success("Recharge successful");
                    refetch();
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Recharge failed");
                  }
                }}
                isLoading={isAgentRechargePending}
              />
            </CardContent>
          </Card>
        )}

        {currentOperator?.role === OperatorRole.AGENT && (
          <Card>
            <CardHeader>
              <CardTitle>Withdraw for User</CardTitle>
            </CardHeader>
            <CardContent>
              <WithdrawForm
                onSubmit={async (amount) => {
                  try {
                    await redeemFromUser({ userId, amount });
                    toast.success("Withdrawal successful");
                    refetch();
                  } catch (e: any) {
                    toast.error(e?.response?.data?.message || "Withdrawal failed");
                  }
                }}
                isLoading={isWithdrawPending}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </section>
  );
};

export default OperatorUserWalletPage;

// Recharge form
const rechargeSchema = z.object({ amount: z.coerce.number().positive("Enter a valid amount") });
const RechargeForm = ({ onSubmit, isLoading }: { onSubmit: (amount: number) => Promise<void> | void, isLoading?: boolean }) => {
  const form = useForm<{ amount: number }>({ resolver: zodResolver(rechargeSchema), defaultValues: { amount: 0 } });
  const { control, handleSubmit, reset } = form;

  const submit = async (values: { amount: number }) => {
    await onSubmit(values.amount);
    reset({ amount: 0 });
  };

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormInput control={control} name="amount" label="Amount" type="number" placeholder="Enter amount" />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Recharge"}</Button>
      </div>
    </FormProvider>
  );
};

const withdrawSchema = z.object({ amount: z.coerce.number().positive("Enter a valid amount") });
const WithdrawForm = ({ onSubmit, isLoading }: { onSubmit: (amount: number) => Promise<void> | void, isLoading?: boolean }) => {
  const form = useForm<{ amount: number }>({ resolver: zodResolver(withdrawSchema), defaultValues: { amount: 0 } });
  const { control, handleSubmit, reset } = form;

  const submit = async (values: { amount: number }) => {
    await onSubmit(values.amount);
    reset({ amount: 0 });
  };

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormInput control={control} name="amount" label="Amount" type="number" placeholder="Enter amount" />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Withdraw"}</Button>
      </div>
    </FormProvider>
  );
};


