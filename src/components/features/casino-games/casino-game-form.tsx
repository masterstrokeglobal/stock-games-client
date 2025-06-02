import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image-compact";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import FormSwitch from "@/components/ui/form/form-switch";
import { GameCategory, GameStatus, GameTypeEnum, ProviderEnum } from "@/models/casino-games";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const casinoFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    imageUrl: z.string().min(1, "Image URL is required"),
    providerName: z.nativeEnum(ProviderEnum, {
        errorMap: () => ({ message: "Invalid provider name" })
    }),
    subProviderName: z.nativeEnum(ProviderEnum, {
        errorMap: () => ({ message: "Invalid sub provider name" })
    }),
    category: z.nativeEnum(GameCategory, {
        errorMap: () => ({ message: "Invalid game category" })
    }),
    status: z.nativeEnum(GameStatus, {
        errorMap: () => ({ message: "Invalid status" })
    }),
    type: z.nativeEnum(GameTypeEnum, {
        errorMap: () => ({ message: "Invalid game type" })
    }),
    gameId: z.string().min(1, "Game ID is required"),
    popular: z.boolean(),
    new: z.boolean()
});

export type CasinoGameFormType = z.infer<typeof casinoFormSchema>;

// Convert enums to options for select components
const providerOptions = Object.values(ProviderEnum).map(provider => ({
    label: provider,
    value: provider
}));

const categoryOptions = Object.values(GameCategory).map(category => ({
    label: category,
    value: category
}));

const statusOptions = Object.values(GameStatus).map(status => ({
    label: status,
    value: status
}));

const typeOptions = Object.values(GameTypeEnum).map(type => ({
    label: type,
    value: type
}));

type Props = {
    defaultValues?: CasinoGameFormType;
    onSubmit: (data: CasinoGameFormType) => void;
    isLoading?: boolean;
};

const CasinoGameForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<CasinoGameFormType>({
        resolver: zodResolver(casinoFormSchema),
        defaultValues: defaultValues,
    });

    const { control, handleSubmit, reset } = form;

    const handleReset = () => {
        reset(defaultValues);
    };

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="name"
                    control={control}
                    label="Name*"
                    placeholder="Enter game name"
                />

                <FormInput
                    name="gameId"
                    control={control}
                    label="Game ID*"
                    placeholder="Enter unique game ID"
                />
            </div>

            <FormImage
                name="imageUrl"
                control={control}
                label="Image*"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroupSelect
                    control={control}
                    options={providerOptions}
                    name="providerName"
                    label="Provider*"
                    placeholder="Select provider"
                />

                <FormGroupSelect
                    control={control}
                    options={providerOptions}
                    name="subProviderName"
                    label="Sub Provider*"
                    placeholder="Select sub provider"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormGroupSelect
                    control={control}
                    options={categoryOptions}
                    name="category"
                    label="Category*"
                    placeholder="Select category"
                />

                <FormGroupSelect
                    control={control}
                    options={statusOptions}
                    name="status"
                    label="Status*"
                    placeholder="Select status"
                />

                <FormGroupSelect
                    control={control}
                    options={typeOptions}
                    name="type"
                    label="Game Type*"
                    placeholder="Select type"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSwitch
                    control={control}
                    name="popular"
                    label="Popular Game"
                    description="Mark this game as popular"
                />

                <FormSwitch
                    control={control}
                    name="new"
                    label="New Game"
                    description="Mark this game as new"
                />
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Casino Game"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default CasinoGameForm;