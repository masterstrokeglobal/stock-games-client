"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Zod schema for validating the registration form fields
export const createRegisterSchema = z.object({
    //full name with first and last name
    name: z.string().min(3).max(100).refine((data) => data.split(" ").length > 1, {
        message: "Please enter your full name",
    }),

    //international
    phone: z
        .string()
        .nonempty("Phone number is required")
        .regex(
            /^\+?[1-9]\d{1,14}$/,
            "Invalid phone number format. Include country code, e.g., +1234567890"
        ),

    username: z.string().max(100).nonempty("Username is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters") // Password length validation
        .max(20, "Password must be less than 20 characters")
        .nonempty("Password is required"),
})

export type RegisterFormValues = z.infer<typeof createRegisterSchema>;

type Props = {
    defaultValues?: RegisterFormValues;
    onSubmit: (data: RegisterFormValues) => void;
    isLoading?: boolean;
};

const RegisterForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(createRegisterSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;
    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl text-center mb-10 text-white ">Create an Account</h1>
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <FormInput
                    control={control}
                    game
                    name="name"
                    label="Full Name*"
                    required
                />

                <FormInput
                    control={control}
                    game
                    name="username"
                    label="Username*"
                    required
                />
                {/* Email Field */}
                {/* Phone Field */}
                <FormInput
                    control={control}
                    game
                    name="phone"
                    label="Phone Number*"
                    required
                />
                {/* Password Field */}
                <FormInput
                    control={control}
                    game
                    name="password"
                    type="password"
                    label="Password*"
                    required
                />

                <footer className="flex justify-end  flex-col gap-2 mt-12 ">
                    <p className="text-sm text-white text-center">By continuing you agree with our terms of services</p>
                    <Button type="submit" size="lg" variant="game" className="w-full" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </Button>
                </footer>

                <div className="flex items-center justify-center gap-3 text-white">
                    <Separator className="my-6 flex-1 bg-white/20" />
                    <span>
                        Or
                    </span>
                    <Separator className="my-6 flex-1  bg-white/20" />
                </div>
                <Button size="lg" variant="secondary" className="w-full bg-[#182B5A] border-[#EFF8FF17] text-white">

                    <img className="mr-2 size-5" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" />

                    Continue with Google
                </Button>
                <Button variant="ghost" className="text-[#F9F9F9B2] flex  mt-8" fullWidth>
                    Have an account already?
                    <Link href="/game/auth/register" className="text-white">
                        sign in here
                    </Link>
                </Button>
            </FormProvider>
        </div>
    );
};

export default RegisterForm;
