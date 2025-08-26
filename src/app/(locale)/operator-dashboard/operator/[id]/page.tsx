"use client";
import OperatorForm from "@/components/features/operator/operator-form";
import { useParams, useRouter } from "next/navigation";
import { OperatorFormValues } from "@/components/features/operator/operator-form";
import { AdminRole } from "@/models/admin";
import { useGetOperatorById, useUpdateOperator } from "@/react-query/operator-queries";
import { useMemo } from "react";

const UpdateOperatorPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { mutate, isPending } = useUpdateOperator();
    const { data: operator } = useGetOperatorById(Number(id));

    const defaultValues = useMemo(() => {
        if (!operator) return null;
        return {
            name: operator.name,
            email: operator.email,
            role: operator.role,
            percentageShare: operator.percentageShare,
            dmMaxBalance: operator.dmMaxBalance,
            masterMaxBalance: operator.masterMaxBalance,
            agentMaxBalance: operator.agentMaxBalance,
        };
    }, [operator]);

    const onSubmit = (data: OperatorFormValues) => {
        mutate({
            id: Number(id),
            ...data,
        }, {
            onSuccess: () => {
                router.push("/dashboard/operator");
            },
        });
    };
    return (
        <>
            <section className="container-main min-h-[60vh] max-w-xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">Update Operator</h2>
                </header>
                <main className="mt-4">
                    {defaultValues && <OperatorForm
                        onSubmit={onSubmit}
                        isEditing
                        isLoading={isPending}
                        currentUserRole={AdminRole.SUPER_ADMIN}
                        defaultValues={defaultValues}
                    />}
                </main>
            </section>
        </>
    );
};

export default UpdateOperatorPage;