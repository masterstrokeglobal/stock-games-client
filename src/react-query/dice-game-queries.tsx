import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import diceGameAPI from "@/lib/axios/dice-game-API";
import { DicePlacement } from "@/models/dice-placement";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { AxiosError } from "axios";

export const useCreateDiceGamePlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: diceGameAPI.createDiceGamePlacement,
        onSuccess: (data, variables) => {
            const { amount, number } = variables;
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "dice-game" || query.queryKey[0] === "myPlacements" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
            toast.custom((t) => (
                <BetSuccessToast onClose={() => toast.dismiss(t)} betAmount={amount} betNumber={number} />
            ), {
                position: 'top-right'
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error?.response?.data?.message;
            toast.custom((t) => (
                <BetErrorToast message={errorMessage} onClose={() => toast.dismiss(t)} />
            ), {
                position: 'top-right'
            });
        },
    });
};


export const BetSuccessToast = ({ className, onClose, betAmount, betNumber }: PropsWithClassName<{
    onClose: () => void,
    betAmount: number,
    betNumber: number
}>) => {
    return (
        <div className={cn("flex items-center p-4 bg-gradient-to-t from-blue-500 via-cyan-400 to-green-400 text-white rounded-lg shadow-lg min-w-[320px] relative", className)} >
            {/* Content */}
            <div className="flex items-center gap-4 ">
                {/* Character illustration */}

                {/* Text content */}
                <div className="flex-1">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="w-6 h-6  mb-4 rounded-full flex items-center justify-center text-[#013FCF] transition-colors"
                    >
                        <XCircle />
                    </button>
                    <h3 style={{ textShadow: '1px 1px 0px #4467CC, -1px -1px 0px #4467CC, 1px -1px 0px #4467CC, -1px 1px 0px #4467CC' }} className="text-lg font-bold  text-white ">Bet Placed Successfully</h3>
                    <p
                        style={{ textShadow: '1px 1px 0px #4467CC, -1px -1px 0px #4467CC, 1px -1px 0px #4467CC, -1px 1px 0px #4467CC' }} className="text-base opacity-90 text-white">{betNumber} for ₹ {betAmount}</p>
                </div>
                <div className="flex-shrink-0">
                    <img src="/images/dice-game/toast-lady.png" alt="lady" className="h-32 absolute bottom-1/4 right-0" />
                </div>
            </div>
        </div>
    )
}

export const BetErrorToast = ({ className, message = " Please try Again", onClose }: PropsWithClassName<{
    onClose: () => void,
    message?: string
}>) => {
    return (
        <div
            style={{ background: 'linear-gradient(171.89deg, #FF9285 5.45%, #D9330D 49.61%, #B9090C 93.76%)' }}
            className={cn("flex items-center p-4  text-white rounded-lg shadow-lg min-w-[320px] relative", className)} >
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <button
                        onClick={onClose}
                        className="w-6 h-6  mb-4 rounded-full flex items-center justify-center  transition-colors"
                    >
                        <XCircle />
                    </button>
                    <h3 className="text-lg font-bold  text-white ">{message}</h3>
                </div>
                <div className="flex-shrink-0">
                    <img src="/images/dice-game/toast-error.png" alt="lady" className="h-32 absolute bottom-1/4 right-0" />
                </div>
            </div>
        </div>
    )
}


export const useGetMyCurrentRoundDiceGamePlacement = (roundId: number) => {
    return useQuery<DicePlacement[]>({
        queryKey: ["dice-game", "my-current-round-placements", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getMyCurrentRoundDiceGamePlacement(roundId);
            return data.data.map((placement: any) => new DicePlacement(placement));
        },
        enabled: !!roundId
    });
};

export const useGetCurrentRoundDiceGamePlacement = (roundId: number) => {
    return useQuery<DicePlacement[]>({
        queryKey: ["dice-game", "myPlacements", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getCurrentRoundDiceGamePlacement(roundId);
            return data.data.map((placement: any) => new DicePlacement(placement));
        },
        enabled: !!roundId
    });
};

export const useGetDiceGameRoundResult = (roundId: number, open: boolean) => {
    return useQuery({
        queryKey: ["dice-game-round-result", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getDiceGameRoundResult(roundId);
            return data.data;
        },
        enabled: !!roundId && open
    });
};