"use client";
import OperatorForm, { OperatorFormValues } from "@/components/features/operator/operator-form";
import { AdminRole } from "@/models/admin";
import { useCreateOperator } from "@/react-query/operator-queries";
import { useRouter } from "next/navigation";

const CreateOperatorPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateOperator();

    const onSubmit = (data: OperatorFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/operators");
            },
        });
    };

    return (
        <>
            <section className="container-main min-h-[60vh] max-w-xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">Create Operator</h2>
                </header>
                <main className="mt-4">
                    <OperatorForm
                        onSubmit={onSubmit}
                        isLoading={isPending}
                        currentUserRole={AdminRole.SUPER_ADMIN}
                    />
                </main>
            </section>
        </>
    );
};

export default CreateOperatorPage;