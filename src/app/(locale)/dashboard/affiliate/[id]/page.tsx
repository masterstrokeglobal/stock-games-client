"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AffiliateForm, { AffiliateFormValues } from "@/components/features/affiliate/affiliate-form"; // Adjust the import based on your file structure
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import Affiliate from "@/models/affiliate";
import { useGetAffiliateById, useUpdateAffiliate } from "@/react-query/affiliate-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";


const EditAffiliatePage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data, isFetching } = useGetAffiliateById(id as string);
    const { mutate, isPending } = useUpdateAffiliate();
    const { userDetails } = useAuthStore();

    const isSubAffiliate = (userDetails as Admin)?.role === AdminRole.AFFILIATE;

    const defaultValues: AffiliateFormValues | null = useMemo(() => {
        const affiliate = data?.data.affiliate ? new Affiliate(data.data.affiliate) : null;
        if (!affiliate) return null;
        return {
            id: affiliate.id,
            username: affiliate.username,
            canCreateSubAffiliate: affiliate.canCreateSubAffiliate,
            comission: affiliate.comission,
            referralBonus: affiliate.referralBonus,
            isPercentage: affiliate.isPercentage,
            minAmount: affiliate.minAmount,
            maxAmount: affiliate.maxAmount,
            provideMaxAmount: affiliate.maxAmount ? true : false,
            role: affiliate.role,
            placementNotAllowed: affiliate.placementNotAllowed,
            referenceCode: affiliate.referenceCode,
            parentAffiliate: affiliate.parentAffiliate,
            name: affiliate.name,
            password: affiliate.password,

        } as AffiliateFormValues;
    }, [data]);

    const onSubmit = (data: AffiliateFormValues) => {
        let payload = data;

        if (!data.provideMaxAmount) {
            payload = {
                ...data,
                maxAmount: undefined,
            };
        }

        mutate({ id: id as string, payload }, {
            onSuccess: () => {
                router.push("/dashboard/affiliate");
            },
        });
    };

    if (isFetching || !defaultValues) return <LoadingScreen />
    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Affiliate</h2>
            </header>
            <Separator className="mt-4" />
            <main className="mt-4">
                {defaultValues && (
                    <AffiliateForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        isLoading={isPending}
                        subAffiliate={isSubAffiliate}
                    />
                )}
            </main>
        </section>
    );
};

export default EditAffiliatePage;