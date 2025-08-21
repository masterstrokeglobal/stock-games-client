import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from "@/components/ui/form/form-password";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import { AdminRole } from "@/models/admin";
import { OperatorRole } from "@/models/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";



export const createOperatorInputSchema = z.object({
    name: z.string().min(2, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    role: z.nativeEnum(OperatorRole, { required_error: "Role is required" }),
    maxBalance: z.coerce.number().min(0, "Max balance must be non-negative").default(0),
    percentageShare: z.coerce.number().min(0, "Percentage share must be non-negative").max(100, "Percentage share cannot exceed 100").default(0),
    dmMaxBalance: z.coerce.number().min(0, "DM max balance must be non-negative").default(0).optional(),
    masterMaxBalance: z.coerce.number().min(0, "Master max balance must be non-negative").default(0).optional(),
    agentMaxBalance: z.coerce.number().min(0, "Agent max balance must be non-negative").default(0).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type OperatorFormValues = z.infer<typeof createOperatorInputSchema>;

type Props = {
    onSubmit: (data: OperatorFormValues) => void;
    defaultValues?: Partial<OperatorFormValues>;
    isLoading?: boolean;
    isEditing?: boolean;
    currentUserRole: OperatorRole | AdminRole.SUPER_ADMIN;
};

const OperatorForm = ({
    onSubmit,
    defaultValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: OperatorRole.AGENT,
        maxBalance: 0,
        percentageShare: 0,
        dmMaxBalance: 0,
        masterMaxBalance: 0,
        agentMaxBalance: 0,
    },
    isLoading,
    isEditing = false,
    currentUserRole
}: Props) => {
    const form = useForm<OperatorFormValues>({
        resolver: zodResolver(createOperatorInputSchema),
        defaultValues,
    });

    const { control, handleSubmit, watch } = form;
    const passwordValue = watch("password");
    const selectedRole = watch("role");

    // Check if current user is super duper master (can set balance limits)
    const canSetBalanceLimits = currentUserRole === AdminRole.SUPER_ADMIN;

    // Role options based on current user's role
    const getRoleOptions = () => {
        const allRoles = [
            { value: OperatorRole.SUPER_DUPER_MASTER, label: "Super Duper Master" },
            { value: OperatorRole.DUPER_MASTER, label: "Duper Master" },
            { value: OperatorRole.MASTER, label: "Master" },
            { value: OperatorRole.AGENT, label: "Agent" },
        ];

        // Super Duper Master can create any role
        if (currentUserRole === AdminRole.SUPER_ADMIN) {
            return allRoles;
        }
        if (currentUserRole === OperatorRole.SUPER_DUPER_MASTER) {
            return allRoles.filter(role => role.value !== OperatorRole.SUPER_DUPER_MASTER);
        }
        // Duper Master can create Master and Agent
        if (currentUserRole === OperatorRole.DUPER_MASTER) {
            return allRoles.filter(role =>
                role.value === OperatorRole.MASTER || role.value === OperatorRole.AGENT
            );
        }
        // Master can create Agent
        if (currentUserRole === OperatorRole.MASTER) {
            return allRoles.filter(role => role.value === OperatorRole.AGENT);
        }
        // Agent cannot create operators
        return [];
    };

    const roleOptions = getRoleOptions();

    return (
        <FormProvider
            methods={form}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <FormInput
                control={control}
                name="name"
                label="Name*"
                placeholder="Enter operator name"
            />

            <FormInput
                control={control}
                name="email"
                label="Email*"
                type="email"
                placeholder="Enter email address"
            />

            <FormSelect
                control={control}
                name="role"
                label="Role*"
                placeholder="Select role"
                options={roleOptions}
            />

            <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                    control={control}
                    name="maxBalance"
                    label="Max Balance*"
                    type="number"
                    placeholder="Enter max balance"
                />
                <FormInput
                    control={control}
                    name="percentageShare"
                    label="Percentage Share*"
                    type="number"
                    placeholder="Enter percentage share (0-100)"
                    min={0}
                    max={100}
                />
            </div>

            {canSetBalanceLimits && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Balance Limits (Super Duper Master Only)</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <FormInput
                            control={control}
                            name="dmMaxBalance"
                            label="Duper Master Max Balance"
                            type="number"
                            placeholder="Enter DM max balance"
                        />
                        <FormInput
                            control={control}
                            name="masterMaxBalance"
                            label="Master Max Balance"
                            type="number"
                            placeholder="Enter Master max balance"
                        />
                        <FormInput
                            control={control}
                            name="agentMaxBalance"
                            label="Agent Max Balance"
                            type="number"
                            placeholder="Enter Agent max balance"
                        />
                    </div>
                </div>
            )}

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
                    {isLoading ? "Saving..." : isEditing ? "Update Operator" : "Create Operator"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default OperatorForm;