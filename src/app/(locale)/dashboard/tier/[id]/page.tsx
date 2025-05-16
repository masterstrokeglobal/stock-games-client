"use client"
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/loading-screen";
import TierForm, { TierFormSchema } from "@/components/features/tier/tier-form";
import { useGetTierById, useUpdateTier } from "@/react-query/tier-queries";

const TierPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: tier, isLoading } = useGetTierById(id as string);

    const { mutate: updateTier, isPending } = useUpdateTier();

    if (isLoading) return <LoadingScreen />

    if (!tier) return <div>Tier not found</div>

    const defaultValues: TierFormSchema = {
        name: tier.name,
        imageUrl: tier.imageUrl,
        minPoints: tier.minPoints,
        redeemablePoints: tier.redeemablePoints,
        loginPoints: tier.loginPoints,
        firstGamePoints: tier.firstGamePoints,
        gamesRequired: tier.gamesRequired,
        pointsPerHundredRupees: tier.pointsPerHundredRupees,
    }


    const onSubmit = (data: TierFormSchema) => {
        const payload = {
            ...data,
            id: tier.id
        }
        updateTier(payload, {
            onSuccess: () => {
                router.push("/dashboard/tier");
            }
        });
    }
    return (
        <section className="container mx-auto">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tier</h1>
            </header>
            <TierForm onSubmit={onSubmit} defaultValues={defaultValues} isLoading={isPending} />
        </section>
    )
}


export default TierPage;