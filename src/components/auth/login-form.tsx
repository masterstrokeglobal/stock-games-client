"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../ui/form/form-input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import FormProvider from "../ui/form/form-provider";
import FormPassword from "../ui/form/form-password";
import { useAdminLogin } from "@/react-query/admin-auth-queries";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import FormGroupSelect from "../ui/form/form-select";

const loginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .max(255, { message: "Email must be less than 255 characters" }),
    loginAs: z.nativeEnum(AdminRole),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: LoginFormValues = {
    email: "",
    password: "",
    loginAs: AdminRole.SUPER_ADMIN,
};

const LoginForm = () => {
    const { setUser } = useAuthStore();
    const router = useRouter();
    const { mutate, isPending } = useAdminLogin();
    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues,
    });


    const onSubmit = (formValue: LoginFormValues) => {
        mutate({
            email: formValue.email,
            password: formValue.password,
            role: formValue.loginAs,
        }, {
            onSuccess: (data) => {
                const admin = new Admin(data.data.admin);
                setUser(admin);
                router.push("/dashboard");
            }
        });
    };

    return (
        <FormProvider className="w-full space-y-3" methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput
                control={form.control}
                label="Email"
                name="email"
                type="email"
            />
            <FormPassword
                control={form.control}
                label="Password"
                name="password"
            />
            <FormGroupSelect
                control={form.control}
                label="Login As"
                name="loginAs"
                options={[
                    { label: "Admin", value: AdminRole.SUPER_ADMIN },
                    { label: "Agent", value: AdminRole.AGENT },
                ]}
            />
            <div className="space-y-2 pt-2">
                <Button disabled={isPending} className="block w-full"  >
                    Login
                </Button>
            </div>
        </FormProvider>
    );
};

export default LoginForm;