"use client"
import TierForm, { TierFormSchema } from "@/components/features/tier/tier-form"
import { useCreateTier } from "@/react-query/tier-queries"
import { useRouter } from "next/navigation";

const CreateTierPage = () => {
    const { mutate: createTier, isPending } = useCreateTier();
    const router = useRouter();

    const onSubmit = (data: TierFormSchema) => {
        createTier(data, {
            onSuccess: () => {
                router.push("/dashboard/tier");
            }
        });
    }
    return (
        <section className="container mx-auto">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create Tier</h1>
            </header>
            <TierForm onSubmit={onSubmit} isLoading={isPending} />
        </section>
    )
}

export default CreateTierPage