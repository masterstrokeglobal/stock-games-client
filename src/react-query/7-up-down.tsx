import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sevenUpDownAPI } from "@/lib/axios/7-up-down-API";
import SevenUpDownPlacement from "@/models/seven-up-down";
import { SevenUpDownRoundResult } from "@/lib/axios/7-up-down-API";
export const useCreateSevenUpDownPlacement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sevenUpDownAPI.createSevenUpDownPlacement,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "sevenUpDown" || query.queryKey[0] === "myPlacements" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
            
            const placement = new SevenUpDownPlacement(data.stockSlotPlacement)
            toast.custom((t) => (
                <BetSuccessToast onClose={() => toast.dismiss(t)} betAmount={placement.amount} betNumber={placement.id} betSide={placement.placement} />
            ), {
                position: 'bottom-right'
            });
        },
        onError: (error: any) => {
            console.error(error)
            toast.error(error.response?.data?.message ?? "Error placing bet");
        },
    });
};


import { cn } from "@/lib/utils";

export const BetSuccessToast = ({
    className,
    onClose,
    betAmount,
    betSide = "7up"
}: PropsWithClassName<{
    onClose: () => void,
    betAmount: number,
    betNumber: number,
    betSide?: string
}>) => {
    // Format the bet side for display
    const sideLabel = betSide === "up" || betSide === "7up" ? "7up" : betSide === "down" ? "7down" : betSide;

    return (
        <div
            className={cn(
                "relative rounded-2xl min-w-[340px]  md:max-w-xs w-full  max-w-sm px-4 md:py-6 py-2 bg-[#7EA7F3] border-2 border-[#003AA3] flex md:flex-col flex-row items-center gap-x-2",
                className
            )}
            style={{ boxShadow: "0px 7px 0px 0px #2D78FF" }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute z-10 top-3 right-3 w-7 h-7 font-montserrat text-xl flex items-center justify-center rounded-full hover:bg-[#003AA3]/10 transition"
                aria-label="Close"
            >
                X
            </button>

            {/* Badge with blurred box behind */}
            <div className="relative flex flex-col items-center md:w-full md:mb-2">
                {/* Blurred box behind the image */}
                <div
                    className="absolute left-1/2 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-[#0C50C1] blur-[12px] sm:blur-[18px] z-0"
                    style={{
                        filter: "blur(12px)",
                    }}
                />
                {/* Badge image */}
                <img
                    src="/images/seven-up-down/win-badge.png"
                    alt="Congrats badge"
                    className="relative z-10 w-16 h-16 sm:w-[120px] sm:h-[120px] object-contain"
                />
            </div>

            {/* Text content */}
            <div className="flex flex-col md:items-center w-full z-10">
                <div className="text-[#0F1E4D] md:text-center w-full text-left text-xl md:text-2xl font-extrabold font-montserrat mb-1" style={{ letterSpacing: "-0.5px" }}>
                    Congrats!
                </div>

                <div className="text-[#0F1E4D] text-base md:text-center text-left md:max-w-xs font-poppins  mb-1">
                    Your {betAmount} bet on {sideLabel} has been placed
                </div>
            </div>
        </div>
    );
};


export const useGetMyCurrentRoundSevenUpDownPlacement = (roundId: number) => {
    return useQuery<SevenUpDownPlacement[]>({
        queryKey: ["sevenUpDown", "myPlacements", roundId],
        queryFn: async () => {
            const response = await sevenUpDownAPI.getMyCurrentRoundSevenUpDownPlacement(roundId);
            return response.data.map((placement: any) => new SevenUpDownPlacement(placement));
        },
    });
};

export const useGetCurrentRoundSevenUpDownPlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["sevenUpDown", "currentRoundPlacements", roundId],
        queryFn: () => sevenUpDownAPI.getCurrentRoundSevenUpDownPlacement(roundId),
    });
};

export const useGetSevenUpDownRoundResult = (roundId: number, enable: boolean) => {
    return useQuery<SevenUpDownRoundResult[]>({
        queryKey: ["sevenUpDown", "roundResult", roundId],
        queryFn: () => sevenUpDownAPI.getSevenUpDownRoundResult(roundId),
        enabled: enable,
    });
};
