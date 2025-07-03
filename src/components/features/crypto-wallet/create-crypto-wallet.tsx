"use client";
import { useCreateCryptoWallet } from "@/react-query/crypto-wallet-queries";
import CryptoWalletForm, { CryptoWalletFormSchema } from "./crypto-wallet-form";

const CreateCryptoWallet = () => {  
    const { mutate: createCryptoWallet, isPending: isCreateCryptoWalletLoading } = useCreateCryptoWallet();

    const handleSubmit = (data: CryptoWalletFormSchema) => {
        createCryptoWallet(data);
    };

    return <CryptoWalletForm onSubmit={handleSubmit} isLoading={isCreateCryptoWalletLoading} />;
};

export default CreateCryptoWallet;  