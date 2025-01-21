"use client";
import AgentUserTable from "@/components/features/agent/agent-users";
import { useParams } from "next/navigation";

const AgentUsersPage = () => {
    const id = useParams().id;
    const agentId = id.toString();
    return (
        <AgentUserTable agentId={agentId} />
    );
}

export default AgentUsersPage;