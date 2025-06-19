"use client";
import CreateSevenUpDownPairForm from "@/components/features/seven-up-down-pair/create-seven-up-pair-form";

const CreateSevenUpDownPair = () => {
    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                        <h2 className="text-xl font-semibold">Create Seven Up Down Pair</h2>
            </header>
            <main className="mt-4">
                <CreateSevenUpDownPairForm />
            </main>
        </section>
    )
}

export default CreateSevenUpDownPair;