"use client";

import React from "react";
import MarketItemForm, { MarketItemFormValues } from "@/components/features/market-items/market-item-form";
import { useCreateMarketItem } from "@/react-query/market-item-queries";
import { useRouter } from "next/navigation";
import { SchedulerType } from "@/models/market-item";

const defaultValues: MarketItemFormValues = {
    name: "",
    code: "",
    active: false,
    oddsMultiplier: 1,
    type: SchedulerType.NSE.toString(),
};

const CreateMarketItemPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateMarketItem();

    const onSubmit = (data: MarketItemFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/market-items"); // Redirect after creation
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Market Item</h2>
            </header>
            <main className="mt-4">
                <MarketItemForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            </main>
        </section>
    );
};

export default CreateMarketItemPage;
