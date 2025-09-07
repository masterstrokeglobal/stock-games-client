"use client";
import OperatorForm, { OperatorFormValues } from "@/components/features/operator/operator-form";
import { AdminRole } from "@/models/admin";
import { OperatorRole } from "@/models/operator";
import { useCreateOperator } from "@/react-query/operator-queries";
import { useRouter } from "next/navigation";

const defaultValues: OperatorFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: OperatorRole.SUPER_DUPER_MASTER,
    maxBalance: 0,
    percentageShare: 0,
    dmMaxBalance: 0,
    masterMaxBalance: 0,
    agentMaxBalance: 0,
};
const CreateOperatorPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateOperator();

    const onSubmit = (data: OperatorFormValues) => {
        mutate(data, {
            onSuccess: (res: any) => {
                const newId = res?.data?.id;
                if (newId) {
                    router.push(`/operator-dashboard?operatorId=${newId}`);
                } else {
                    router.push("/operator-dashboard");
                }
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
                    <OperatorForm
                        onSubmit={onSubmit}
                        defaultValues={defaultValues}
                        isLoading={isPending}
                        currentUserRole={AdminRole.COMPANY_ADMIN}
                    />
                </main>
            </section>
        </>
    );
};

export default CreateOperatorPage;