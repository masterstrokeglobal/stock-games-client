import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image-compact";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormSwitch from "@/components/ui/form/form-switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdvertisementType } from "@/models/advertisment";
import FormSelect from "@/components/ui/form/form-select";
const advertismentSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.string().url().optional().or(z.undefined()).or(z.literal("")).or(z.null()),
    mobileImage: z.string().url().optional().or(z.undefined()).or(z.literal("")).or(z.null()),
    type: z.nativeEnum(AdvertisementType),
    link: z.union([z.string().url(), z.literal("")]),
    active: z.boolean().default(true),
}).superRefine((data, ctx) => {
    if (data.type !== AdvertisementType.NOTICE && !data.image) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image is required for banner and slider advertisements",
            path: ["image"]
        });
    }
});

export type AdvertismentFormSchema = z.infer<typeof advertismentSchema>

const advertismentTypeOptions = [
    { label: "Banner", value: AdvertisementType.BANNER },
    { label: "Slider", value: AdvertisementType.SLIDER },
    { label: "Notice", value: AdvertisementType.NOTICE },
]

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

    const adType = form.watch("type");


    return (
        <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
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

            <FormSelect
                control={form.control}
                name="type"
                label="Type"
                options={advertismentTypeOptions}
            />

            {adType !== AdvertisementType.SLIDER ? (
                adType === AdvertisementType.BANNER && (
                    <FormImage
                        control={form.control}
                        name="image"
                        label="Banner Image"
                        description="Square image - width: 300px height: 300px max size: 5MB"
                        aspectRatio={1}
                        aspectRatioDescription="1:1"
                        maxSize={5}
                    />)
            ) : (
                <>
                    <FormImage
                        control={form.control}
                        name="image"
                        label="Desktop Image"
                        description="Aspect ratio: 16:9 width: 1200px height: 675px max size: 5MB"
                        aspectRatio={16 / 9}
                        aspectRatioDescription="16:9"
                        maxSize={5}
                    />

                    <FormImage
                        control={form.control}
                        name="mobileImage"
                        label="Mobile Image (Optional)"
                        description="Aspect ratio: 5:4 width: 375px height: 300px max size: 5MB"
                        aspectRatio={5 / 4}
                        aspectRatioDescription="5:4"
                        maxSize={5}
                    />
                </>
            )}

            <FormInput
                control={form.control}
                name="link"
                label="Link"
                placeholder="Link"
            />

            <FormSwitch
                control={form.control}
                name="active"
                label="Active"
            />
            <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit"}</Button>
        </FormProvider>
    )
}
