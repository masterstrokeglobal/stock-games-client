"use client";

import LoadingScreen from "@/components/common/loading-screen";
import OperatorProfitLossDashboard from "@/components/features/operator/operator-profit-loss-dashboard";
import { useGetCurrentOperator } from "@/react-query/operator-queries";

const OperatorProfitLossPage = () => {
    const { data: operator, isLoading } = useGetCurrentOperator();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!operator?.id) {
        return (
            <div className="container-main max-w-6xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-600 mt-2">Unable to load operator information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-main max-w-6xl mx-auto p-6">
            <OperatorProfitLossDashboard operatorId={operator.id} />
        </div>
    );
};

export default OperatorProfitLossPage;
