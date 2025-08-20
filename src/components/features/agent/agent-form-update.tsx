import { Button } from "@/components/ui/button";
import 
FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormSwitch from "@/components/ui/form/form-switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createAgentInputSchema = z.object({
    firstname: z.string().min(2, "First name is required").max(50),
    lastname: z.string().min(2, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    enableTransactions: z.boolean().default(false),
});

export type AgentFormValues = z.infer<typeof createAgentInputSchema>;

type Props = {
    onSubmit: (data: AgentFormValues) => void;
    defaultValues?: AgentFormValues;
    isLoading?: boolean;
};

const AgentForm = ({
    onSubmit,
    defaultValues = {
        firstname: '',
        lastname: '',
        email: '',
        enableTransactions: false,
    },
    isLoading
}: Props) => {
    const form = useForm<AgentFormValues>({
        resolver: zodResolver(createAgentInputSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    return (
        <FormProvider
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                    control={control}
                    name="firstname"
                    label="First Name*"
                    placeholder="Enter first name"
                />
                <FormInput
                    control={control}
                    name="lastname"
                    label="Last Name*"
                    placeholder="Enter last name"
                />
            </div>

            <FormInput
                control={control}
                name="email"
                label="Email*"
                type="email"
                placeholder="Enter email address"
            />

            <FormSwitch
                control={control}
                name="enableTransactions"
                label="Enable Transactions"
                description=" If enabled, the agent can perform transactions for user deposit and withdrawal"

            />

            <footer className="flex justify-end gap-4 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Create Agent"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default AgentForm;