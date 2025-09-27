import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/context/auth-context";
import { OperatorRole } from "@/models/operator";
import { useMemo } from "react";
import { useGetBelowOperators, useGetCurrentOperator } from "@/react-query/operator-queries";

const baseUserSchema = z.object({
    firstname: z.string().min(2, "First name is required").max(50),
    lastname: z.string().min(2, "Last name is required").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(30),
    password: z.string().min(6, "Password must be at least 6 characters"),
    operatorId: z.string().optional(),
});

export type AgentUserFormValues = z.infer<typeof baseUserSchema>;

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
    const { userDetails } = useAuthStore();
    const currentRole = (userDetails as any)?.role as string | undefined;
    const isAgent = currentRole === OperatorRole.AGENT;

    const { data: currentOperator } = useGetCurrentOperator();
    const currentOperatorId = currentOperator?.id ?? 0;
    const { data: belowOperators } = useGetBelowOperators(
        { operatorId: currentOperatorId, page: 1, limit: 100 },
        { enabled: !!currentOperatorId && !isAgent }
    );

    const agentOptions = useMemo(() => {
        const list = belowOperators?.data ?? [];
        return list
            .filter((op: any) => String(op.role).toLowerCase() === String(OperatorRole.AGENT))
            .map((op: any) => ({ value: String(op.id), label: op.name ?? `Agent #${op.id}` }));
    }, [belowOperators]);

    const schema = useMemo(() => {
        return isAgent
            ? baseUserSchema
            : baseUserSchema.extend({
                operatorId: z.string({ required_error: "Agent is required" }).min(1, "Agent is required"),
            });
    }, [isAgent]);

    const form = useForm<AgentUserFormValues>({
        resolver: zodResolver(schema),
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

            {!isAgent && (
                <FormSelect
                    control={control}
                    name="operatorId"
                    label="Assign to operator"
                    placeholder="Select agent"
                    options={agentOptions}
                />
            )}

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
                    {isLoading ? "Creating..." : "Create User"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default AgentUserForm;