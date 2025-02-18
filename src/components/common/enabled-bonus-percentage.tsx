import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import FormSwitch from "@/components/ui/form/form-switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const bonusPercentageSchema = z.object({
    depositBonusPercentageEnabled: z.boolean().default(false)
});

export type BonusPercentageFormValues = z.infer<typeof bonusPercentageSchema>;

type Props = {
    defaultValues?: BonusPercentageFormValues;
    onSubmit: (data: BonusPercentageFormValues) => void;
    isLoading?: boolean;
};

const DepositEnabledFormPercentage = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<BonusPercentageFormValues>({
        resolver: zodResolver(bonusPercentageSchema),
        defaultValues: {
            ...defaultValues,
        },
    });

    const { control, handleSubmit } = form;

    return (

        <FormProvider
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <FormSwitch
                control={control}
                name="depositBonusPercentageEnabled"
                label="Enable Deposit Bonus Percentage"
            />

            <footer className="flex justify-end gap-4 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default DepositEnabledFormPercentage;