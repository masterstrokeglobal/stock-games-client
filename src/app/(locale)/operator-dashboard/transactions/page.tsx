"use client"
import LoadingScreen from "@/components/common/loading-screen";
import OperatorTransactionTable from "@/components/features/operator/operator-transaction-table"
import { useGetCurrentOperator } from "@/react-query/operator-queries";

const OperatorTransactionPage = () => {

    const { data ,isLoading} = useGetCurrentOperator();

    if(isLoading){
        return <LoadingScreen />
    }

    return (
        data?.id && <OperatorTransactionTable operatorId={data.id} />   
    )
}

export default OperatorTransactionPage