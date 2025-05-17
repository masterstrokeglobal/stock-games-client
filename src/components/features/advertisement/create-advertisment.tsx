"use client"
import { useCreateAdvertisement } from "@/react-query/advertisment-queries"
import { AdvertismentForm, AdvertismentFormSchema } from "./advertisment-form"
import { useRouter } from "next/navigation";
import { AdvertisementType } from "@/models/advertisment";
const defaultValues: AdvertismentFormSchema = {
    name: "",
    description: "",
    image: "",
    link: "",
    type: AdvertisementType.BANNER,
    active: true,
}
const CreateAdvertisment = () => {
    const router = useRouter();
    const { mutate: createAdvertisment, isPending } = useCreateAdvertisement();

    const handleSubmit = (data: AdvertismentFormSchema) => {
        createAdvertisment(data, {
            onSuccess: () => {
                router.push("/dashboard/advertisements");
            }
        });
    }
    return (
        <section className="flex flex-col gap-4 max-w-2xl"    >
            <h1 className="text-2xl font-bold mb-4">Create Advertisment</h1>
            <AdvertismentForm
                onSubmit={handleSubmit}
                isLoading={isPending}
                defaultValues={defaultValues}
            />
        </section>
    )
}

export default CreateAdvertisment;
