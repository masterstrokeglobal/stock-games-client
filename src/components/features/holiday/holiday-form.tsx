import { Button } from "@/components/ui/button";
import FormDatePicker from "@/components/ui/form/form-date-picker";
import cFormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import { SchedulerType } from "@/models/market-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
export const createHolidayInputSchema = z.object({
    type: z.nativeEnum(SchedulerType, {
        errorMap: () => ({ message: "Type is required" })
    }),
    date: z.coerce.date()
});

export type HolidayFormValues = z.infer<typeof createHolidayInputSchema>;

const typeOptions = [
    { label: "NSE", value: SchedulerType.NSE.toString() },
    { label: "Crypto", value: SchedulerType.CRYPTO.toString() }
];

type Props = {
    defaultValues?: HolidayFormValues;
    onSubmit: (data: HolidayFormValues) => void;
    isLoading?: boolean;
};

const HolidayForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<HolidayFormValues>({
        resolver: zodResolver(createHolidayInputSchema),
        defaultValues
    });

    const { control, handleSubmit } = form;

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormGroupSelect
                control={control}
                name="type"
                label="Scheduler Type"
                options={typeOptions}
            />
            <FormDatePicker
                control={control}
                name="date"
                type="date"
                label="Holiday Date"
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Holiday"}
            </Button>
        </FormProvider>
    );
};

export default HolidayForm;