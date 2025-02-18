import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "../ui/card";

export const bonusPercentageSchema = z.object({
    depositBonusPercentage: z.coerce.number().min(0).max(100),
});

export type BonusPercentageFormValues = z.infer<typeof bonusPercentageSchema>;

type Props = {
    defaultValues?: BonusPercentageFormValues;
    onSubmit: (data: BonusPercentageFormValues) => void;
    isLoading?: boolean;
};

const UpdateAgentBonusPercentageForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<BonusPercentageFormValues>({
        resolver: zodResolver(bonusPercentageSchema),
        defaultValues: {
            ...defaultValues,
        },
    });

    const { control, handleSubmit } = form;
    return (
        <Card className=" my-6">
            <CardHeader>
                <h3 className="text-lg font-semibold">Update Deposit Bonus Percentage</h3>
            </CardHeader>

            <CardContent>

                <FormProvider
                    methods={form}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormInput
                        control={control}
                        name="depositBonusPercentage"
                        label="Deposit Bonus Percentage"
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
            </CardContent>

        </Card>
    );
};

export default UpdateAgentBonusPercentageForm;