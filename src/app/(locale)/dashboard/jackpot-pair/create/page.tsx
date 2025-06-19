"use client";
import CreateJackpotPairForm from "@/components/features/jackpot-pair/create-jackpot-pair-form";

const CreateJackpotPair = () => {
    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                        <h2 className="text-xl font-semibold">Create Jackpot Pair</h2>
            </header>
            <main className="mt-4">
                <CreateJackpotPairForm />
            </main>
        </section>
    )
}

export default CreateJackpotPair;