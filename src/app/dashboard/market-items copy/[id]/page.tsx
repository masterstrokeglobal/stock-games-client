"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import MarketItemForm, { MarketItemFormValues } from "@/components/features/market-items/market-item-form";
import { useGetMarketItemById, useUpdateMarketItemById } from "@/react-query/market-item-queries";
import { useParams, useRouter } from "next/navigation";

const EditMarketItemPage = () => {
    const params = useParams();
    const { id } = params; // Extract market item ID from URL parameters
    const { data, isLoading, isSuccess } = useGetMarketItemById(id.toString()); // Fetch market item data
    const { mutate, isPending } = useUpdateMarketItemById(); // Hook for updating market item
    const router = useRouter();

    // Set default values for the form once data is fetched successfully
    const defaultValues: MarketItemFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const marketItem = data.data;

        return {
            id: marketItem.id?.toString(),
            type: marketItem.type,
            name: marketItem.name,
            code: marketItem.code,
            active: marketItem.active,
            oddsMultiplier: marketItem.oddsMultiplier,
        };
    }, [data, isSuccess]);

    const onSubmit = (formData: MarketItemFormValues) => {
        mutate(formData, {
            onSuccess: () => {
                router.push("/dashboard/market-items"); // Redirect after successful update
            },
        });
    };

    if (isLoading) {
        return <LoadingScreen>Loading market item...</LoadingScreen>; // Show loading screen
    }

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Market Item</h2>
            </header>
            <main className="mt-4">
                {defaultValues && (
                    <MarketItemForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        isLoading={isPending} // Show loading state when submitting
                    />
                )}
            </main>
        </section>
    );
};

export default EditMarketItemPage;
