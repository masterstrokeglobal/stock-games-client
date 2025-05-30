"use client";
import CreateCoinTossPairForm from "@/components/features/coin-head-tail/create-coin-toss-pair";

const CreateCoinTossPair = () => {
    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Coin Toss Pair</h2>
            </header>
            <main className="mt-4">
                <CreateCoinTossPairForm />
            </main>
        </section>
    )
}

export default CreateCoinTossPair;