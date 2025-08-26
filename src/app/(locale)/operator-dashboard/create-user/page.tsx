"use client";

import AgentUserForm, { AgentUserFormValues } from "@/components/features/agent/agent-user-form";
import { useCreateUser } from "@/react-query/operator-queries";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
    const router = useRouter();
    const createUserMutation = useCreateUser();

    const handleSubmit = async (data: AgentUserFormValues) => {
        try {
            await createUserMutation.mutateAsync(data);
            router.push("/operator-dashboard");
        } catch (error) {
            // Error is already handled by the mutation's onError callback
            console.error("Failed to create user:", error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
                    <p className="text-gray-600 mt-2">
                        Create a new user account for the platform
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <AgentUserForm
                        onSubmit={handleSubmit}
                        isLoading={createUserMutation.isPending}
                    />
                </div>
            </div>
        </div>
    );
}