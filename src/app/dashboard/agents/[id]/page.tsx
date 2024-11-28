"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AgentDetailsCard from "@/components/features/agent/agent-card";
import Agent from "@/models/agent"; // Agent model class
import { useGetAgentById } from "@/react-query/agent-queries"; // Replace with the actual agent query hook
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

    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading agent...</LoadingScreen>;

    console.log(agentDetails);

    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                {agentDetails && <AgentDetailsCard agent={agentDetails} />}
            </main>
        </section>
    );
};

export default ViewAgentPage;
