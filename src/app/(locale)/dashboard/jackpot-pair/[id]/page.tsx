"use client";
import EditJackpotPairForm from "@/components/features/jackpot-pair/edit-jackpot-pair-form";
import { useParams } from "next/navigation";

function EditJackpotPairPage() {

    const { id } = useParams();


    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Jackpot Pair</h2>
            </header>
            <main className="mt-4">
                <EditJackpotPairForm id={id as string} />
            </main>
        </section>
    );
}

export default EditJackpotPairPage;
