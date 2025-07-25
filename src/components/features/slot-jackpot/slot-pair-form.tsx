"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import FormComboboxSelect from "@/components/ui/form/form-combobox";
import { SchedulerType } from "@/models/market-item";
import FormSwitch from "@/components/ui/form/form-switch";
import { MarketItem } from "@/models/market-item";
import { useGetMarketItems } from "@/react-query/market-item-queries";
import { schedulerTypeOptions } from "@/lib/utils";

const createSlotPairSchema = z.object({
    type: z.nativeEnum(SchedulerType, { required_error: "Type is required" }),
    marketItems: z.array(z.string().min(1, "Slot market item is required")).length(5, "Exactly 5 slots are required"),
    active: z.boolean().default(false),
});

export type SlotPairFormValues = z.infer<typeof createSlotPairSchema>;

type Props = {
    onSubmit: (data: SlotPairFormValues) => void;
    isLoading?: boolean;
    defaultValues?: SlotPairFormValues;
}

const SlotPairForm = ({ onSubmit, isLoading, defaultValues }: Props) => {
    const [slotSearches, setSlotSearches] = useState<string[]>(["", "", "", "", ""]);

    const form = useForm<SlotPairFormValues>({
        resolver: zodResolver(createSlotPairSchema),
        defaultValues: defaultValues
    });

    const { control } = form;
    const type = form.watch("type");

    const marketItemsQueries = useMarketItemsQueries(slotSearches, type);

    const slotOptions = useMemo(() => {
        return marketItemsQueries.map(query =>
            query.data?.data.marketItems?.map((item: MarketItem) => ({
                label: item.name,
                value: item.id?.toString() || ""
            })) || []
        );
    }, [marketItemsQueries]);

    const handleSearchChange = (index: number, value: string) => {
        const newSearches = [...slotSearches];
        newSearches[index] = value;
        setSlotSearches(newSearches);
    };

    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormGroupSelect
                control={control}
                options={schedulerTypeOptions}
                name="type"
                label="Scheduler Type*"
            />

            <div className="grid grid-cols-1 gap-4">
                {[0, 1, 2, 3, 4].map((index) => (
                    <FormComboboxSelect
                        key={index}
                        className="w-full"
                        name={`marketItems.${index}`}
                        disabled={marketItemsQueries[index].isLoading}
                        onSearchInputChange={(value) => handleSearchChange(index, value)}
                        placeholder={`Select Slot ${index + 1} Market Item`}
                        control={control}
                        options={slotOptions[index]}
                        label={`Slot ${index + 1} Market Item*`}
                    />
                ))}
            </div>

            <FormSwitch control={control} name="active" label="Active" />

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Create Pair"}
                </Button>
            </footer>
        </FormProvider>
    );
}

export default SlotPairForm;


const useMarketItemsQueries = (slotSearches: string[], type: SchedulerType) => {
    const marketItemsQueries1 = useGetMarketItems({
        search: slotSearches[0],
        limit: 500,
        page: 1,
        type: type
    });

    const marketItemsQueries2 = useGetMarketItems({
        search: slotSearches[1],
        limit: 500,
        page: 1,
        type: type
    });

    const marketItemsQueries3 = useGetMarketItems({
        search: slotSearches[2],
        limit: 500,
        page: 1,
        type: type
    });


    const marketItemsQueries4 = useGetMarketItems({
        search: slotSearches[3],
        limit: 500,
        page: 1,
        type: type
    });


    const marketItemsQueries5 = useGetMarketItems({
        search: slotSearches[4],
        limit: 500,
        page: 1,
        type: type
    });

    return [marketItemsQueries1, marketItemsQueries2, marketItemsQueries3, marketItemsQueries4, marketItemsQueries5];
}