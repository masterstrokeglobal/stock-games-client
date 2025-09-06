"use client";
import OperatorInfoCard from "@/components/features/operator/operator-info-card";
import { useGetCurrentOperator } from "@/react-query/operator-queries";

const OperatorDashboardPage = () => {
    const { data: operator } = useGetCurrentOperator();

    return (
        <div className="container-main max-w-6xl mx-auto p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Operator Dashboard</h1>
            </header>
            <main>
                {operator && <OperatorInfoCard operator={operator} />}
            </main>
        </div>
    )
}

export default OperatorDashboardPage