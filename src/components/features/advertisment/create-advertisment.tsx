import { useCreateAdvertisement } from "@/react-query/advertisment-queries"
import { AdvertismentForm, AdvertismentFormSchema } from "./advertisment-form"

const defaultValues: AdvertismentFormSchema = {
    name: "",
    description: "",
    image: "",
    link: "",
}
const CreateAdvertisment = () => {
    const { mutate: createAdvertisment, isPending } = useCreateAdvertisement()
    return (
        <section className="flex flex-col gap-4"    >
            <h1 className="text-2xl font-bold mb-4">Create Advertisment</h1>
            <AdvertismentForm
                onSubmit={createAdvertisment}
                isLoading={isPending}
                defaultValues={defaultValues}
            />
        </section>
    )
}

export default CreateAdvertisment;
