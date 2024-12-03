"use client";
import AgentProfitLossCard from "@/components/features/agent/agent-profit-loss";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/context/auth-context";
import { useGetAgentProfitLoss } from "@/react-query/agent-queries";
import { useMemo } from "react";

const AgentProfitLoss = () => {
    const { userDetails } = useAuthStore();

    const agentId = userDetails?.id;

    const {
        data,
        isSuccess,
        isLoading,
    } = useGetAgentProfitLoss(agentId?.toString());

    const profitLoss = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return null;
    }, [data, isSuccess]);

    console.log(profitLoss);
    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                <h1 className="text-2xl font-semibold">Agent Profit and Loss</h1>
                <Separator />
                {isLoading && <div>Loading...</div>}
                {isSuccess && <AgentProfitLossCard data={profitLoss} />}
            </main>
        </section>
    );
};

export default AgentProfitLoss;