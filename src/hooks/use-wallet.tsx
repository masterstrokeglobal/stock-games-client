import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import { useMemo } from "react";

const useWallet = () => {
    const { data, isLoading } = useGetWallet();

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data, isLoading]);

    return wallet;
}

export default useWallet;