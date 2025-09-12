import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createAgentUserInputSchema = z.object({
    firstname: z.string().min(2, "First name is required").max(50),
    lastname: z.string().min(2, "Last name is required").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(30),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AgentUserFormValues = z.infer<typeof createAgentUserInputSchema>;

type Props = {
    onSubmit: (data: AgentUserFormValues) => void;
    defaultValues?: AgentUserFormValues;
    isLoading?: boolean;
};

const AgentUserForm = ({
    onSubmit,
    defaultValues = {
        firstname: '',
        lastname: '',
        username: '',
        password: ''
    },
    isLoading
}: Props) => {
    const form = useForm<AgentUserFormValues>({
        resolver: zodResolver(createAgentUserInputSchema),
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
                name="username"
                label="Username*"
                placeholder="Enter username"
            />

            <FormPassword
                control={control}
                name="password"
                label="Password*"
                type="password"
                placeholder="Enter password"
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
                    {isLoading ? "Creating..." : "Create Agent User"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default AgentUserForm;