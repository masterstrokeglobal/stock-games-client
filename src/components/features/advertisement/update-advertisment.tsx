"use client"
import {
    useGetAdvertisementById, useUpdateAdvertisementById
} from "@/react-query/advertisment-queries"
import { useParams, useRouter } from "next/navigation"
import { AdvertismentForm, AdvertismentFormSchema } from "./advertisment-form"

const UpdateAdvertisment = () => {
    const router = useRouter();
    const { id } = useParams()
    const { data: advertisment, isLoading } = useGetAdvertisementById(id as string);
    const { mutate: updateAdvertisment, isPending } = useUpdateAdvertisementById();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!advertisment) {
        return <div>Advertisment not found</div>
    }

    const handleSubmit = (data: AdvertismentFormSchema) => {
        updateAdvertisment({ id: id.toString(), ...data }, {
            onSuccess: () => {
                router.push("/dashboard/advertisements");
            }
        });
    }

    return (
        <section className="flex flex-col gap-4 max-w-2xl"    >
            <h1 className="text-2xl font-bold mb-4">Update Advertisment</h1>
            <AdvertismentForm
                defaultValues={advertisment.data}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
        </section>
    )
}

export default UpdateAdvertisment;