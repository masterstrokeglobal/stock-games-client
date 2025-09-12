import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormMultiInput from "@/components/ui/form/form-multi-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import { GameApiName } from "@/models/company-api-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

export const createCompanyApiDetailsInputSchema = z.object({
    apiKey: z.string().optional(),
    baseUrl: z.string().url("Please enter a valid URL").nonempty("Base URL is required"),
    allowedIps: z.array(z.string().ip("Please enter valid IP addresses")).min(1, "At least one IP address is required"),
    allowedGames: z.array(z.object({
        value: z.nativeEnum(GameApiName)
    })).min(1, "At least one game must be selected").default([{ value: GameApiName.ALL }]),
});

export type CompanyApiDetailsFormValues = z.infer<typeof createCompanyApiDetailsInputSchema>;

type Props = {
    defaultValues?: CompanyApiDetailsFormValues;
    onSubmit: (data: CompanyApiDetailsFormValues) => void;
    isLoading?: boolean;
};

const CompanyApiDetailsForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<CompanyApiDetailsFormValues>({
        resolver: zodResolver(createCompanyApiDetailsInputSchema),
        defaultValues: {
            allowedGames: [{ value: GameApiName.ALL }],
            allowedIps: [],
            ...defaultValues,
        },
    });

    const { control, handleSubmit, reset } = form;

    const { fields: gameFields, append: appendGame, remove: removeGame } = useFieldArray({
        control,
        name: "allowedGames",
    });

    const handleReset = () => {
        reset({
            baseUrl: "",
            allowedIps: [],
            allowedGames: [],
        });
    };

    // Convert GameApiName enum to options for the select
    const gameOptions = Object.values(GameApiName).map(game => ({
        label: game,
        value: game,
    }));

    const addGame = () => {
        appendGame({ value: GameApiName.ALL });
    };

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
                control={control}
                name="baseUrl"
                label="Base URL*"
                placeholder="https://api.example.com"
            />

            <FormMultiInput
                control={control}
                name="allowedIps"
                label="Allowed IP Addresses*"
                placeholder="192.168.1.1"
                description="Enter IP addresses that are allowed to access this API"
            />

            <div className="space-y-2">
                <label className="text-sm font-medium">Allowed Games*</label>
                {gameFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormSelect
                            control={control}
                            name={`allowedGames.${index}.value`}
                            options={gameOptions}
                            defaultValue={field.value}
                            placeholder="Select a game"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeGame(index)}
                            disabled={gameFields.length === 1}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGame}
                >
                    Add Game
                </Button>
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save API Details"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default CompanyApiDetailsForm;