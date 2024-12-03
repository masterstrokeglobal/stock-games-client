"use client";
import React from "react";
import AgentForm, { AgentFormValues } from "@/components/features/agent/agent-form"; // Adjust the import
import { useCreateAgent } from "@/react-query/agent-queries"; // Replace with the actual agent query hooks
import { useRouter } from "next/navigation";

const CreateAgentPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateAgent();

    const onSubmit = (data: AgentFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/agents"); 
            },
        });
    };

    return (
        <>
            <section className="container-main min-h-[60vh] max-w-xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">Create Agent</h2>
                </header>
                <main className="mt-4">
                    <AgentForm
                        onSubmit={onSubmit}
                        isLoading={isPending}
                    />
                </main>
            </section>
        </>
    );
};

export default CreateAgentPage;
