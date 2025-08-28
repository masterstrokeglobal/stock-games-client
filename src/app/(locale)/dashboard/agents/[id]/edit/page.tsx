"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AgentForm, { AgentFormValues } from "@/components/features/agent/agent-form-update";
import { useGetAgentById, useUpdateAgent } from "@/react-query/agent-queries"; // Replace with the actual agent query hook
import { useParams } from "next/navigation";
import { useMemo } from "react";

const EditAgentPage = () => {

    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetAgentById(id.toString());

    const { mutate: updateAgent, isPending } = useUpdateAgent()


    const agentDetails: AgentFormValues | null = useMemo(() => {
        if (isSuccess) {
            return {
                firstname: data?.data.firstname,
                lastname: data?.data.lastname,
                email: data?.data.email,
                enableTransactions: data?.data.enableTransactions,
            };
        }
        return null;
    }, [data, isSuccess]);

    const handleSubmit = (updatedData: AgentFormValues) => {
        updateAgent({
            agentId: id.toString(),
            updateData: updatedData,
        });
    };


    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading agent...</LoadingScreen>;

    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                {agentDetails && <AgentForm onSubmit={handleSubmit} isLoading={isPending} defaultValues={agentDetails} />}
            </main>
        </section>
    );
};

export default EditAgentPage;
