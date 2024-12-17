"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AgentDetailsCard from "@/components/features/agent/agent-card";
import AgentProfitLossCard from "@/components/features/agent/agent-profit-loss";
import Agent from "@/models/agent"; // Agent model class
import { useGetAgentById, useGetAgentProfitLoss } from "@/react-query/agent-queries"; // Replace with the actual agent query hook
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewAgentPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetAgentById(id.toString());

    const agentDetails = useMemo(() => {
        if (isSuccess) {
            return new Agent(data?.data);
        }
        return null;
    }, [data, isSuccess]);

    const {
        data: profitLossData,
        isSuccess: isProfitLossSuccess,
    } = useGetAgentProfitLoss(id?.toString());

    const profitLoss = useMemo(() => {
        if (isProfitLossSuccess) {
            return profitLossData?.data;
        }
        return null;
    }, [profitLossData, isProfitLossSuccess]);
    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading agent...</LoadingScreen>;



    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                {agentDetails && <AgentDetailsCard agent={agentDetails} />}
                {isProfitLossSuccess && <AgentProfitLossCard data={profitLoss} />}
            </main>
        </section>
    );
};

export default ViewAgentPage;
