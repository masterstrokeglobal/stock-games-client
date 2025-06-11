"use client";
import EditTossPairForm from "@/components/features/coin-head-tail/edit-toss-pair-form";
import { useParams } from "next/navigation";

function EditCoinTossPairPage() {

    const { id } = useParams();

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-8">Edit Coin Toss Pair</h1>
            <EditTossPairForm id={id as string} />
        </div>
    );
}

export default EditCoinTossPairPage;
