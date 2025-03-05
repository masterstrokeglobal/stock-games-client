"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { Loader2 } from "lucide-react";

interface GenericFormProps<T extends z.ZodType> {
    title: string;
    schema: T;
    defaultValues: z.infer<T>;
    onSubmit: (values: z.infer<T>) => void;
    inputLabel: string;
    inputDescription?: string;
    submitButtonText: string;
    isSubmitting?: boolean;
    isLoading?: boolean;
}

const GenericForm = <T extends z.ZodType>({
    title,
    schema,
    defaultValues,
    onSubmit,
    inputLabel,
    inputDescription,
    submitButtonText,
    isSubmitting = false,
    isLoading = false,
}: GenericFormProps<T>) => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <Card className="w-full max-w-md relative">
            {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <FormProvider form={form} onSubmit={onSubmit}>
                <CardContent>
                    <FormInput
                        control={form.control}
                        name="amount"
                        label={inputLabel}
                        description={inputDescription}
                        disabled={isLoading}
                    />
                </CardContent>
                <CardFooter>
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            submitButtonText
                        )}
                    </Button>
                </CardFooter>
            </FormProvider>
        </Card>
    );
};

export default GenericForm;
