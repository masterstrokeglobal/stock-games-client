"use client";
import EditSevenUpDownPairForm from "@/components/features/seven-up-down-pair/edit-seven-up-down-pair-form";
import { useParams } from "next/navigation";

function EditSevenUpDownPairPage() {

    const { id } = useParams();


    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Seven Up Down Pair</h2>
            </header>
            <main className="mt-4">
                <EditSevenUpDownPairForm id={id as string} />
            </main>
        </section>
    );
}

export default EditSevenUpDownPairPage;
