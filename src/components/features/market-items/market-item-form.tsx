import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import { SchedulerType } from "@/models/market-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createMarketItemInputSchema = z.object({
    id: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    name: z.string().max(100).min(3, "Name should be at least 3 characters"),
    code: z.string().max(50).min(1, "Code is required"),
    active: z.boolean().default(false).optional(),
    oddsMultiplier: z.coerce
        .number().min(1).max(100),
});

export type MarketItemFormValues = z.infer<typeof createMarketItemInputSchema>;

const typeOptions = [
    { label: "NSE", value: SchedulerType.NSE.toString() },
    { label: "Crypto", value: SchedulerType.CRYPTO.toString() },

];
type Props = {
    defaultValues?: MarketItemFormValues;
    onSubmit: (data: MarketItemFormValues) => void;
    isLoading?: boolean;
};

const MarketItemForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<MarketItemFormValues>({
        resolver: zodResolver(createMarketItemInputSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;
    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormGroupSelect
                control={control} options={typeOptions} name={"type"}
            />
            <FormInput
                control={control}
                name="name"
                label="Name*"
                placeholder="e.g., Baazar Style Retail Ltd."
            />
            <FormInput
                control={control}
                name="code"
                label="Code*"
                placeholder="e.g., STYLEBAAZA"
            />
            <FormInput
                control={control}
                name="oddsMultiplier"
                label="Odds Multiplier*"
                type="number"
                placeholder="e.g., 8"
            />
            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => { }}>Reset</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Market Item"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default MarketItemForm;
