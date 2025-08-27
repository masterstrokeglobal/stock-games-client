"use client";
import OperatorForm from "@/components/features/operator/operator-form";
import { useParams, useRouter } from "next/navigation";
import { OperatorFormValues } from "@/components/features/operator/operator-form";
import { AdminRole } from "@/models/admin";
import { useGetOperatorById, useUpdateOperator, useUpdateBettingStatus, useUpdateTransferStatus } from "@/react-query/operator-queries";
import { useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const UpdateOperatorPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { mutate, isPending } = useUpdateOperator();
    const { data: operator } = useGetOperatorById(Number(id));
    const { mutate: updateBettingStatus, isPending: isBettingStatusPending } = useUpdateBettingStatus();
    const { mutate: updateTransferStatus, isPending: isTransferStatusPending } = useUpdateTransferStatus();

    const defaultValues = useMemo(() => {
        if (!operator) return null;
        return {
            name: operator.name,
            email: operator.email,
            role: operator.role,
            percentageShare: operator.percentageShare,
            dmMaxBalance: operator.dmMaxBalance,
            masterMaxBalance: operator.masterMaxBalance,
            agentMaxBalance: operator.agentMaxBalance,
        };
    }, [operator]);

    const onSubmit = (data: OperatorFormValues) => {
        mutate({
            id: Number(id),
            ...data,
        }, {
            onSuccess: () => {
                router.push("/dashboard/operator");
            },
        });
    };

    const handleBettingStatusToggle = (checked: boolean) => {
        updateBettingStatus({
            id: Number(id),
            status: checked
        });
    };

    const handleTransferStatusToggle = (checked: boolean) => {
        updateTransferStatus({
            id: Number(id),
            status: checked
        });
    };
    return (
        <>
            <section className="container-main min-h-[60vh] max-w-xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                    <h2 className="text-xl font-semibold">Update Operator</h2>
                </header>
                <main className="mt-4">
                    {/* Status Controls */}
                    {operator && (
                        <div className="mb-6 p-4 border rounded-lg bg-card">
                            <h3 className="text-lg font-medium mb-4">Status Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="betting-status" className="text-sm font-medium">
                                        Betting Status
                                    </Label>
                                    <Switch
                                        id="betting-status"
                                        checked={operator.bettingStatus}
                                        onCheckedChange={handleBettingStatusToggle}
                                        disabled={isBettingStatusPending}
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="transfer-status" className="text-sm font-medium">
                                        Transfer Status
                                    </Label>
                                    <Switch
                                        id="transfer-status"
                                        checked={operator.transferStatus}
                                        onCheckedChange={handleTransferStatusToggle}
                                        disabled={isTransferStatusPending}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {defaultValues && <OperatorForm
                        onSubmit={onSubmit}
                        isEditing
                        isLoading={isPending}
                        currentUserRole={AdminRole.SUPER_ADMIN}
                        defaultValues={defaultValues}
                    />}
                </main>
            </section>
        </>
    );
};

export default UpdateOperatorPage;