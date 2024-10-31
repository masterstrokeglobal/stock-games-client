"use client";
import FormProvider from "../ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Fragment, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useStepper } from "@/context/stepper-context";
import {
    useAuthLoginWithOTP,
    useAuthVerifyLoginOTP,
} from "@/react-query/user-query";
import { useRouter, useSearchParams } from "next/navigation";

const otpFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .max(255, { message: "Email must be less than 255 characters" }),
    otp: z.string().length(4, { message: "OTP must be 4 characters" }),
    authMethod: z.enum(["EMAIL"]),
});

type LoginFormValues = z.infer<typeof otpFormSchema>;

const OTPForm = () => {
    const { prevStep } = useStepper();
    const router = useRouter();
    const params = useSearchParams();

    const defaultValues: LoginFormValues = {
        email: atob(params.get("email") ?? "") || "",
        otp: "",
        authMethod: "EMAIL",
    };

    const { mutate, isPending } = useAuthVerifyLoginOTP();

    const { mutate: sendOTP, isPending: sendingOTP } = useAuthLoginWithOTP();

    const resendOTP = () => {
        sendOTP({ email: form.getValues("email") });
    };

    const form = useForm({
        resolver: zodResolver(otpFormSchema),
        defaultValues,
    });

    const email = form.watch("email");
    useEffect(() => {
        form.setValue("email", atob(params.get("email") || ""));
    }, [params]);

    const onSubmit = (data: LoginFormValues) => {
        mutate({
            email: data.email,
            otp: Number(data.otp),
            authMethod: data.authMethod,
        }, {
            onSuccess: () => {
                setTimeout(() => {
                    console.log(localStorage.getItem("token"));
                    router.push("/dashboard");
                }, 500);

            },
        });
    };

    const otp = form.watch("otp");
    return (
        <Fragment>
            <section className="flex flex-col ">
                <main>
                    <FormProvider
                        className="mt-8 space-y-4"
                        methods={form}
                        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
                    >

                        <p className="">
                            {email}{" "}
                            <Button
                                variant={"link"}
                                onClick={prevStep}
                                className="px-0 h-auto  font-medium text-sm py-0 text-primary"
                            >
                                Change
                            </Button>
                        </p>
                        <div>
                            <Label className="mb-4 block">
                                Enter OTP sent to your email address
                            </Label>
                            <InputOTP
                                maxLength={4}
                                value={otp}
                                onChange={(value) => form.setValue("otp", value)}
                            >
                                <InputOTPGroup className="flex  w-full">
                                    <InputOTPSlot className="flex-1" index={0} />
                                    <InputOTPSlot className="flex-1" index={1} />
                                    <InputOTPSlot className="flex-1" index={2} />
                                    <InputOTPSlot className="flex-1" index={3} />
                                </InputOTPGroup>
                            </InputOTP>
                            {form.formState.errors.otp && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.otp.message}
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={() => resendOTP()}
                            disabled={sendingOTP}
                            variant={"link"}
                            type="button"
                            className="text-primary ml-auto px-0 flex justify-end"
                        >
                            {sendingOTP ? "Sending OTP..." : "Resend OTP"}
                        </Button>
                        <div className=" pt-2 pb-8">
                            <Button disabled={isPending} className="block w-full">
                                {isPending ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </div>
                    </FormProvider>
                </main>
            </section>
        </Fragment>
    );
};

export default OTPForm;
