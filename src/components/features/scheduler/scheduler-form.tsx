"use client";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import FormDatePicker from "@/components/ui/form/form-date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { SchedulerType } from "@/models/market-item";

export const createSchedulerInputSchema = z.object({
    id: z.string().optional(),
    companyId: z.string().optional(),
    type: z.nativeEnum(SchedulerType, { required_error: "Type is required" }),
    startDate: z.date({ required_error: "Start Date is required" }),
    endDate: z.date({ required_error: "End Date is required" }),
    startTime: z.string({ required_error: "Start Time is required" }),
    endTime: z.string({ required_error: "End Time is required" }),
    active: z.boolean().default(false).optional(),
});

export type SchedulerFormValues = z.infer<typeof createSchedulerInputSchema>;


type Props = {
    defaultValues?: SchedulerFormValues;
    onSubmit: (data: SchedulerFormValues) => void;
    isLoading?: boolean;
};

const SchedulerForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<SchedulerFormValues>({
        resolver: zodResolver(createSchedulerInputSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    console.log(form.formState.errors)

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit,(e)=>console.error(e))} className="space-y-4">
            {/* Type Dropdown */}
            <FormGroupSelect
                control={control}
                options={[
                    { label: "NSE", value: SchedulerType.NSE },
                    { label: "Crypto", value: SchedulerType.CRYPTO },
                ]}
                name="type"
                label="Scheduler Type*"
            />

            {/* Start Date */}
            <FormDatePicker
                control={control}
                name="startDate"
                label="Start Date*"
            />

            {/* End Date */}
            <FormDatePicker
                control={control}
                name="endDate"
                label="End Date*"
            />

            {/* Start Time */}
            <FormInput
                control={control}
                name="startTime"
                label="Start Time*"
                type="time"
            />

            {/* End Time */}
            <FormInput
                control={control}
                name="endTime"
                label="End Time*"
                type="time"
            />

            {/* Submit Button */}
            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Scheduler"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default SchedulerForm;
