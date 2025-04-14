"use client";

import AffiliateForm, { AffiliateFormValues } from "@/components/features/affiliate/affiliate-form"; // Adjust the import based on your file structure
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useCreateAffiliate } from "@/react-query/affiliate-queries";
import { AffiliateRole } from "@/models/affiliate";

const defaultValues: AffiliateFormValues = {
    name: "",
    username: "",
    password: "",
    companyId: "", 
    referralBonus: 0,
    isPercentage: false,
    role: AffiliateRole.MASTER_AFFILIATE,
};

const CreateAffiliatePage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateAffiliate();

    const onSubmit = (data: AffiliateFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/affiliate");
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Affiliate</h2>
            </header>
            <Separator className="mt-4" />
            <main className="mt-4">
                <AffiliateForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending} // Loading state to show while creating
                />
            </main>
        </section>
    );
};

export default CreateAffiliatePage;