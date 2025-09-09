"use client";
import OperatorForm, { OperatorFormValues } from "@/components/features/operator/operator-form";
import { getLowerRankRole } from "@/models/operator";
import { useCreateOperator, useGetCurrentOperator } from "@/react-query/operator-queries";
import { useRouter } from "next/navigation";

const defaultValues: Omit<OperatorFormValues, "role"> = {
    name: "",
    email: "",
    maxBalance: 0,
    percentageShare: 0,
    password: "",
    confirmPassword: "",
    dmMaxBalance: 0,
    masterMaxBalance: 0,
    agentMaxBalance: 0,
}
const CreateOperatorPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateOperator();
    const { data: operator } = useGetCurrentOperator();

    const onSubmit = (data: OperatorFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/operator-dashboard/operator");
            },
        });
    };


    return (
        <>
            <section className="container-main min-h-[60vh] max-w-2xl mx-auto">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">Create Operator</h2>
                </header>
                <main className="mt-4">
                    {operator && (
                        <OperatorForm
                            onSubmit={onSubmit}
                            isLoading={isPending}
                            currentUserRole={operator?.role}
                            defaultValues={{ ...defaultValues, role: getLowerRankRole(operator.role) }}
                        />
                    )}
                </main>
            </section>
        </>
    );
};

export default CreateOperatorPage;