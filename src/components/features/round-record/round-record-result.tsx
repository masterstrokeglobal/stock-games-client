import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyRoundResult } from '@/react-query/round-record-queries';
import { ArrowDownCircle, ArrowUpCircle, Timer } from "lucide-react";
import { useTranslations } from 'next-intl';
import React from 'react';



interface RoundResultProps {
    roundRecordId: number;
}

const RoundResult: React.FC<RoundResultProps> = ({ roundRecordId }) => {
    const t = useTranslations('round-detail');

    const {
        data: resultData,
        isLoading,
        isError,
    } = useGetMyRoundResult(roundRecordId, true);

    if (isLoading) {
        return (
            <Card className="bg-[#122146] border-[#EFF8FF17]">
                <CardContent className="flex justify-center items-center py-8">
                    <Timer className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        );
    }

    if (isError || !resultData) {
        return (
            <Card className="bg-[#122146] border-[#EFF8FF17]">
                <CardContent className="py-6 text-center text-red-400">
                    {t('errors.result-load-failed')}
                </CardContent>
            </Card>
        );
    }

    const { totalBetAmount, totalWinnings, winningId } = resultData.data;
    const hasWon = winningId !== null;
    const profitLoss = totalWinnings - totalBetAmount;

    return (
        <Card className="bg-[#122146] border-[#EFF8FF17]">
            <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">
                    {t('result.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 text-white text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('result.total-bet')}</span>
                        <span className="font-medium">${totalBetAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('result.total-winnings')}</span>
                        <span className="font-medium">${totalWinnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('result.profit-loss')}</span>
                        <div className={`flex items-center gap-2 font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profitLoss >= 0 ?
                                <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> :
                                <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            }
                            ${Math.abs(profitLoss).toFixed(2)}
                        </div>
                    </div>
                    {hasWon && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">{t('result.winning-bet')}</span>
                            <span className="font-medium">#{winningId}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RoundResult;