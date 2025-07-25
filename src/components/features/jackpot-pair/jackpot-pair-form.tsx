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

// Define SelectOption type if not imported
type SelectOption = {
    label: string;
    value: string;
};

const createJackpotPairSchema = z.object({
    type: z.nativeEnum(SchedulerType, { required_error: "Type is required" }),
    marketItems: z.array(z.string())
        .max(14, "Maximum 14 jackpots are allowed")
        .refine((items) => {
            const uniqueItems = new Set(items.filter(item => item)); // Filter out empty strings
            return uniqueItems.size === items.filter(item => item).length;
        }, "No duplicate market items are allowed"),
    active: z.boolean().default(false),
});

export type JackpotPairFormValues = z.infer<typeof createJackpotPairSchema>;

type Props = {
    onSubmit: (data: JackpotPairFormValues) => void;
    isLoading?: boolean;
    defaultValues?: Partial<JackpotPairFormValues>;
}

const JackpotPairForm = ({ onSubmit, isLoading, defaultValues }: Props) => {
    const [search, setSearch] = useState<string>("");

    const form = useForm<JackpotPairFormValues>({
        resolver: zodResolver(createJackpotPairSchema),
        defaultValues: {
            type: defaultValues?.type,
            marketItems: defaultValues?.marketItems || Array(14).fill(""),
            active: defaultValues?.active || false,
        }
    });

    const { control, watch, formState: { errors } } = form;
    const selectedMarketItems = watch("marketItems") || [];

    const marketItemsQuery = useGetMarketItems({
        search: search,
        limit: 500,
        page: 1,
    });

    const jackpotOptions: SelectOption[] = useMemo(() => {
        const allMarketItems = marketItemsQuery.data?.data.marketItems || [];
        
        return allMarketItems.map((item: MarketItem) => ({
            label: item.name,
            value: item.id?.toString() || ""
        }));
    }, [marketItemsQuery.data]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Check if a market item is already selected in other positions
    const isMarketItemSelected = (currentIndex: number, itemValue: string): boolean => {
        if (!itemValue) return false;
        return selectedMarketItems.some((item, index) => 
            index !== currentIndex && item === itemValue
        );
    };

    const getErrorMessage = (index: number): string | undefined => {
        const currentValue = selectedMarketItems[index];
        const fieldError = errors.marketItems?.[index];
        
        if (fieldError) {
            return fieldError.message;
        }
        
        if (currentValue && isMarketItemSelected(index, currentValue)) {
            return "Market item already selected";
        }
        
        return undefined;
    };

    console.log(selectedMarketItems);

    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormGroupSelect
                control={control}
                options={schedulerTypeOptions}
                name="type"
                label="Scheduler Type*"
            />

            <div className="grid grid-cols-1 gap-4">
                {Array.from({ length: 14 }).map((_, index) => (
                    <FormComboboxSelect
                        key={index}
                        className="w-full"
                        name={`marketItems.${index}`}
                        disabled={marketItemsQuery.isLoading}
                        onSearchInputChange={handleSearchChange}
                        placeholder={`Select Jackpot ${index + 1} Market Item`}
                        control={control}
                        errorMessage={getErrorMessage(index)}
                        options={jackpotOptions}
                        label={`Jackpot ${index + 1} Market Item*`}
                    />
                ))}
            </div>

            {errors.marketItems?.root && (
                <p className="text-red-500">{errors.marketItems.root.message}</p>
            )}
            
            <FormSwitch control={control} name="active" label="Active" />

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Create Jackpot Pair"}
                </Button>
            </footer>
        </FormProvider>
    );
}

export default JackpotPairForm;