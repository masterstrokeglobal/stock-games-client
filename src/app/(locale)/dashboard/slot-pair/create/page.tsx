"use client";
import CreateSlotPairForm from "@/components/features/slot-jackpot/create-slot-pair-form";

const CreateCoinTossPair = () => {
    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Slot Pair</h2>
            </header>
            <main className="mt-4">
                <CreateSlotPairForm />
            </main>
        </section>
    )
}
    
export default CreateCoinTossPair;