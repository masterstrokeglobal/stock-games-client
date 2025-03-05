"use client";
import { WalletFormValues } from "@/columns/company-wallet-add";
import AgentWalletCard from "@/components/features/agent/agent-wallet-card";
import WalletForm from "@/components/features/agent/wallet-form";
import { useAuthStore } from "@/context/auth-context";
import { useCreateAgentChipsWithdrawRequest } from "@/react-query/agent-queries";

const AgentWalletRequestPage = () => {
    const { userDetails } = useAuthStore();
    const agentId = userDetails?.id;
    const { mutate, isPending } = useCreateAgentChipsWithdrawRequest();
    const onSubmit = (formValue: WalletFormValues) => {
        mutate(formValue);
    };
    return (
        <section className="container-main min-h-[60vh]">
            {agentId && <AgentWalletCard agentId={agentId.toString()} />}
            <main className="mt-4 space-y-8">
                <WalletForm onSubmit={onSubmit} isSubmitting={isPending} title="Request Funds For Withdrawal" />
            </main>
        </section>
    );
};

export default AgentWalletRequestPage;