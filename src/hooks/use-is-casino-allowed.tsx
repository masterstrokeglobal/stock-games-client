import { useGetMyCompany } from "@/react-query/company-queries";
import { useEffect, useState } from "react";

const useCasinoAllowed = () => {
    const [casinoAllowed, setCasinoAllowed] = useState(false);
    const { data, isSuccess } = useGetMyCompany();

    useEffect(() => {
        if (isSuccess && data?.allowedCasino) {
            setCasinoAllowed(true);
        } else if (isSuccess) {
            setCasinoAllowed(false);
        }
    }, [isSuccess, data]);

    return casinoAllowed;
}

export default useCasinoAllowed;