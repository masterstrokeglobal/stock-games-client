import { Button } from "@/components/ui/button";
import {  Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/context/auth-context";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BettingControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    roundId: number;
    isLoading: boolean;
    isPlaceOver: boolean;
    showFooterButtons?: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    betAmount,
    setBetAmount,
    isPlaceOver,
}) => {
    const t = useTranslations("game");
    const { userDetails } = useAuthStore();

    const coinValues = userDetails?.company?.coinValues || [100, 200, 1000, 2000];
    const minPlacement = userDetails?.company?.minPlacement ?? 1;
    const maxPlacement = userDetails?.company?.maxPlacement ?? 1000000;


    const handleDecrement = () => {
        setBetAmount(Math.max(minPlacement, betAmount - 100));
    };

    const handleIncrement = () => {
        setBetAmount(Math.min(maxPlacement, betAmount + 100));
    };

    const handleDouble = () => {
        setBetAmount(Math.min(maxPlacement, betAmount * 2));
    };


    return (
        <div className="w-full xl:max-w-xs xl:mx-auto bg-transparent text-game-text md:p-0 px-4 rounded-2xl">
            {/* Top Tabs using shadcn */}
            <Tabs defaultValue="bet" className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="h-10 bg-transparent border border-[#0B4A8F] rounded-full  flex w-full">
                        <TabsTrigger
                            value="bet"
                            className="flex-1 h-full  rounded-full  text-white bg-transparent font-semibold text-base data-[state=active]:bg-[#00214E] data-[state=active]:text-white data-[state=inactive]:text-blue-300"
                            tabIndex={-1}
                        >
                            BET
                        </TabsTrigger>
                        <TabsTrigger
                            value="auto"
                            className="flex-1 h-full rounded-full text-blue-300 bg-transparent font-semibold text-base data-[state=active]:bg-[#00214E] data-[state=active]:text-white data-[state=inactive]:text-blue-300"
                            tabIndex={-1}
                        >
                            AUTO
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Bet Amount Controls and Bet Button */}
                <TabsContent value="bet">
                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center border py-1 border-[#0B5AB6] rounded-full justify-center gap-2">
                                <Button
                                    className="rounded-full w-8 h-8 flex items-center justify-center bg-[#A3EBEB] text-primary-game border-2 border-[#011039] p-0"
                                    variant="ghost"
                                    onClick={handleDecrement}
                                    disabled={isPlaceOver || betAmount <= minPlacement}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    <Minus size={20} />
                                </Button>
                                <span className="text-white text-xl font-bold min-w-[60px] text-center">{betAmount}</span>
                                <Button
                                    className="rounded-full w-8 h-8 flex items-center justify-center bg-[#A3EBEB] text-primary-game border-2 border-[#011039] p-0"
                                    variant="ghost"
                                    onClick={handleIncrement}
                                    disabled={isPlaceOver || betAmount >= maxPlacement}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="grid grid-cols-2 border border-[#0B4A8F] rounded">
                                {coinValues.slice(0, 2).map((amount, index) => (
                                    <Button
                                        key={amount}
                                        className={`w-full h-10 bg-transparent  ${index === 0 ? 'border-r-[#0B4A8F]  border-r' : ''} text-white text-lg font-semibold rounded-none`}
                                        variant="ghost"
                                        onClick={() => setBetAmount(amount)}
                                        disabled={isPlaceOver}
                                        tabIndex={-1}
                                        type="button"
                                    >
                                        ₹ {amount}
                                    </Button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2  border border-[#0B4A8F] rounded">
                                {coinValues.slice(2, 4).map((amount, index) => (
                                    <Button
                                        key={amount}
                                        className={`w-full h-10 bg-transparent border border-[#0B4A8F] text-white text-lg font-semibold rounded-none ${index === 0 ? 'border-r-[#0B4A8F]  border-r' : ''}`}
                                        variant="ghost"
                                        onClick={() => setBetAmount(amount)}
                                        disabled={isPlaceOver}
                                        tabIndex={-1}
                                        type="button"
                                    >
                                        ₹ {amount}
                                    </Button>
                                ))}
                            </div>

                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <Button
                                className="w-full h-20 bg-[#2ECC40]  text-white text-lg font-bold rounded-lg shadow-lg flex flex-col items-center justify-center"
                                style={{ backgroundColor: "#2ECC40" }}
                                disabled={isPlaceOver}
                                tabIndex={-1}
                                type="button"
                            >
                                {t("bet").toUpperCase()}
                                <span className="text-white text-xl font-bold">{betAmount.toFixed(2)} INR</span>
                            </Button>
                            <div className="flex justify-center mb-2">
                                <Button
                                    className="w-full max-w-[200px] h-12 bg-transparent border border-[#0B4A8F] text-white text-lg font-semibold rounded-lg"
                                    variant="ghost"
                                    onClick={handleDouble}
                                    disabled={isPlaceOver || betAmount * 2 > maxPlacement}
                                    tabIndex={-1}
                                    type="button"
                                >
                                    2X BET
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="auto">
                <div className="flex flex-col gap-4 py-2 w-full">
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 5, 10].map((amount) => (
                            <Button
                                key={amount}
                                className="w-full h-10 bg-transparent border border-[#0B4A8F] text-white text-lg font-semibold rounded-lg"
                                variant="ghost"
                                onClick={() => setBetAmount(amount)}
                                disabled={isPlaceOver}
                                tabIndex={-1}
                                type="button"
                            >
                            {amount}
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 h-12 bg-[#2ECC40] text-white text-lg font-bold rounded-lg"
                            disabled={isPlaceOver}
                            tabIndex={-1}
                            type="button"
                        >
                            {t("bet").toUpperCase()}
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-destructive border border-[#0B4A8F] text-white text-lg font-semibold rounded-lg"
                            variant="ghost"
                            onClick={() => setBetAmount(0)}
                            disabled={isPlaceOver}
                            tabIndex={-1}
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

