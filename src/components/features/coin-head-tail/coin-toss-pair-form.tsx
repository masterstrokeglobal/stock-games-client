"use client";

import { Button } from "@/components/ui/button";
import FormComboboxSelect from "@/components/ui/form/form-combobox";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import FormSwitch from "@/components/ui/form/form-switch";
import { schedulerTypeOptions } from "@/lib/utils";
import { MarketItem, SchedulerType } from "@/models/market-item";
import { useGetMarketItems } from "@/react-query/market-item-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const createCoinTossPairSchema = z.object({
    type: z.nativeEnum(SchedulerType, { required_error: "Type is required" }),
    head: z.string().min(1, "Head market item is required"),
    tail: z.string().min(1, "Tail market item is required"),
    active: z.boolean().default(false),
});

export type CoinTossPairFormValues = z.infer<typeof createCoinTossPairSchema>;


type Props = {
    onSubmit: (data: CoinTossPairFormValues) => void;
    isLoading?: boolean;
    defaultValues?: CoinTossPairFormValues;
}

const CoinTossPairForm = ({ onSubmit, isLoading, defaultValues }: Props) => {
    const [headSearch, setHeadSearch] = useState("");
    const [tailSearch, setTailSearch] = useState("");
    
    const form = useForm<CoinTossPairFormValues>({
        resolver: zodResolver(createCoinTossPairSchema),
        defaultValues: defaultValues
    });

    const { control } = form;

    const { data: headMarketItems, isLoading: headMarketItemsLoading } = useGetMarketItems({
        search: headSearch,
        limit: 500,
        page: 1,
    });

    const { data: tailMarketItems, isLoading: tailMarketItemsLoading } = useGetMarketItems({
        search: tailSearch,
        limit: 500,
        page: 1,
    });

    const headOptions = useMemo(() => {
        return headMarketItems?.data.marketItems?.map((item: MarketItem) => ({
            label: `${item.name} (${item.type})`,
            value: item.id?.toString() || ""
        })) || [];
    }, [headMarketItems]);


    const tailOptions = useMemo(() => {
        return tailMarketItems?.data?.marketItems?.map((item: MarketItem) => ({
            label: `${item.name} (${item.type})`,
            value: item.id?.toString() || ""
        })) || [];
    }, [tailMarketItems]);


    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormGroupSelect
                control={control}
                options={schedulerTypeOptions}
                name="type"
                label="Scheduler Type*"
            />

            <div className="grid grid-cols-2 gap-4">
                <FormComboboxSelect
                    className="w-full"
                    name="head"
                    disabled={headMarketItemsLoading}
                    onSearchInputChange={setHeadSearch}
                    placeholder="Select Head Market Item"
                    control={control}
                    options={headOptions} // Will be populated by market items
                    label="Head Market Item*"
                />

                <FormComboboxSelect
                    className="w-full"
                    name="tail"
                    disabled={tailMarketItemsLoading}
                    onSearchInputChange={setTailSearch}
                    placeholder="Select Tail Market Item"
                    control={control}
                    options={tailOptions} // Will be populated by market items
                    label="Tail Market Item*"
                />
            </div>

            <FormSwitch control={control} name="active" label="Active" />

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Pair"}
                </Button>
            </footer>
        </FormProvider>
    );
}


export default CoinTossPairForm;
