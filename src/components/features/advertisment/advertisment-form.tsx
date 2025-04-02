import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const advertismentSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    link: z.string().min(1),
})

export type AdvertismentFormSchema = z.infer<typeof advertismentSchema>

type Props = {
    onSubmit: (data: AdvertismentFormSchema) => void,
    defaultValues: AdvertismentFormSchema,
    className?: string,
    isLoading?: boolean
}

export const AdvertismentForm = ({ defaultValues, onSubmit, className, isLoading }: Props) => {
    const form = useForm<z.infer<typeof advertismentSchema>>({
        resolver: zodResolver(advertismentSchema),
        defaultValues: defaultValues
    })

    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
            <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Name"
            />
            <FormInput
                control={form.control}
                name="description"
                label="Description"
                placeholder="Description"
            />
            <FormImage
                control={form.control}
                name="image"
                label="Image"
            />
            <FormInput
                control={form.control}
                name="link"
                label="Link"
                placeholder="Link"
            />
            <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit"}</Button>
        </FormProvider>
    )
}
