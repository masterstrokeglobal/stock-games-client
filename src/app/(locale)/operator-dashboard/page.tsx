"use client";
import OperatorInfoCard from "@/components/features/operator/operator-info-card";
import OperatorDashboardSummary from "@/components/features/operator/operator-dashboard-summary";
import OperatorHierarchyTree from "@/components/features/operator/operator-hierarchy-tree";
import OperatorRecentTransactions from "@/components/features/operator/operator-recent-transactions";
import { Input } from "@/components/ui/input";
import { useGetOperatorDashboard, useGetCurrentOperator } from "@/react-query/operator-queries";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useMemo } from "react";

const OperatorDashboardPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const operatorIdParam = searchParams.get("operatorId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const operatorId = operatorIdParam ? parseInt(operatorIdParam) : undefined;

    // Fetch current operator for default operatorId if none provided
    const { data: currentOperator } = useGetCurrentOperator();

    const effectiveOperatorId = useMemo(() => operatorId ?? currentOperator?.id, [operatorId, currentOperator]);

    const { data: dashboard } = useGetOperatorDashboard({
        operatorId: effectiveOperatorId,
        startDate,
        endDate,
    });

    const onPickOperator = (id: number) => {
        const params = new URLSearchParams(searchParams as any);
        params.set("operatorId", id.toString());
        router.push(`/operator-dashboard?${params.toString()}`);
    };

    return (
        <div className="container-main max-w-6xl mx-auto p-6 space-y-6">
            <header className="space-y-2">
                <h1 className="text-2xl font-bold">Operator Dashboard</h1>
                {/* Optional admin operator selector placeholder (can be replaced by a proper select) */}
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Operator ID (admin only)" defaultValue={operatorId ?? ''} onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) onPickOperator(value);
                    }} className="max-w-[220px]" />
                </div>
            </header>
            <main className="space-y-6">
                {dashboard?.operator && <OperatorInfoCard operator={dashboard.operator} />}
                <OperatorDashboardSummary stats={dashboard?.stats} wallet={dashboard?.operator?.operatorWallet ?? null} />
                <OperatorHierarchyTree tree={dashboard?.hierarchy} />
                {effectiveOperatorId && (
                    <OperatorRecentTransactions operatorId={effectiveOperatorId} />
                )}
            </main>
        </div>
    )
}

export default OperatorDashboardPage