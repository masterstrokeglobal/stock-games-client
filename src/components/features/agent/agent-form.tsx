import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminRole } from "@/models/admin";
import FormPassword from "@/components/ui/form/form-password";

export const createAgentInputSchema = z.object({
    firstname: z.string().min(2, "First name is required").max(50),
    lastname: z.string().min(2, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type AgentFormValues = z.infer<typeof createAgentInputSchema>;

type Props = {
    onSubmit: (data: AgentFormValues) => void;
    isLoading?: boolean;
};

const AgentForm = ({
    onSubmit,
    isLoading
}: Props) => {
    const form = useForm<AgentFormValues>({
        resolver: zodResolver(createAgentInputSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const { control, handleSubmit, watch } = form;
    const passwordValue = watch("password");

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

            <FormPassword
                control={control}
                name="password"
                label="Password*"
                type="password"
                placeholder="Enter password"
            />

            <FormPassword
                control={control}
                name="confirmPassword"
                label="Confirm Password*"
                type="password"
                placeholder="Confirm password"
                disabled={!passwordValue}
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