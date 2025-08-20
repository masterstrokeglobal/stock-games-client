import { useGetMyCompany } from "@/react-query/company-queries";

const useCasinoAllowed = () => {
    const { data, isLoading } = useGetMyCompany();

    return { isLoading, isCasinoAllowed: data?.allowedCasino ?? false }
}

export default useCasinoAllowed;