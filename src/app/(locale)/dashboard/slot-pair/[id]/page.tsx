"use client";
import EditSlotPairForm from "@/components/features/slot-jackpot/edit-slot-pair-form";
import { useParams } from "next/navigation";

function EditSlotPairPage() {

    const { id } = useParams();


    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-8">Edit Slot Pair</h1>
            <EditSlotPairForm id={id as string} />
        </div>
    );
}

export default EditSlotPairPage;
