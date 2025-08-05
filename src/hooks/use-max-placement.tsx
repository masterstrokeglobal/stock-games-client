import { useGetMyCompany } from "@/react-query/company-queries";
import { RoundRecordGameType } from "@/models/round-record";

const useMaxPlacement = (gameType: RoundRecordGameType) => {
    const { data: company } = useGetMyCompany();
    return {
        minPlacement: company?.minPlacement ?? 0,
        maxPlacement: company?.maxSinglePlacementPerGameType?.[gameType] ?? 1000000,
    }
};

export default useMaxPlacement; 