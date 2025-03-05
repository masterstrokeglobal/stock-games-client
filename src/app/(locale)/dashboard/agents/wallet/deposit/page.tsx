"use client";
import { WalletFormValues } from "@/columns/company-wallet-add";
import AgentWalletCard from "@/components/features/agent/agent-wallet-card";
import WalletForm from "@/components/features/agent/wallet-form";
import { useAuthStore } from "@/context/auth-context";
import { useCreateAgentChipsDepositRequest } from "@/react-query/agent-queries";

const AgentWalletRequestPage = () => {
    const { userDetails } = useAuthStore();
    const agentId = userDetails?.id;
    const { mutate, isPending } = useCreateAgentChipsDepositRequest();
    const onSubmit = (formValue: WalletFormValues) => {
        mutate(formValue);
    };
    return (
        <section className="container-main min-h-[60vh] max-w-3xl">
            {agentId && <AgentWalletCard agentId={agentId.toString()} />}
            <main className="mt-4 space-y-8">
                <WalletForm onSubmit={onSubmit} isSubmitting={isPending} title="Request Coins from the Admin" />
            </main>
        </section>
    );
};

export default AgentWalletRequestPage;