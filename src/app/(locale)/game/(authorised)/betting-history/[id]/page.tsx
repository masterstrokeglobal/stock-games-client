'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import { ArrowUpCircle, ArrowDownCircle, Timer, Calendar, Trophy } from "lucide-react";
import { useParams } from 'next/navigation';
import dayjs from "dayjs";
import { RoundRecord } from '@/models/round-record';
import { useGetRoundRecordById, useRoundBets } from '@/react-query/round-record-queries';
import RoundResult from '@/components/features/round-record/round-record-result';

interface Bet {
    id: number;
    amount: number;
    placementType: string;
    placedValue: string;
    isWinner: boolean;
    placedOn: {
        id: number;
        name: string;
        code: string;
    }[];
}

const BetCard: React.FC<{ bet: Bet }> = ({ bet }) => {
    const t = useTranslations('round-detail');

    return (
        <Card className="bg-secondary-game border-[#EFF8FF17]">
            <CardContent className="pt-6 px-3 sm:px-6">
                <div className="grid gap-4 text-white text-sm sm:text-base">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('bet.id')}</span>
                        <span>#{bet.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('bet.type')}</span>
                        <span className="capitalize">{bet.placedValue || bet.placementType}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-400">{t('bet.placed-on')}</span>
                        <div className="flex flex-wrap gap-2">
                            {bet.placedOn.map(item => (
                                <span key={item.id} className="px-2 sm:px-3 py-1 rounded-full bg-[#1a2b57] text-xs sm:text-sm">
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('bet.amount')}</span>
                        <span className="font-bold">${bet.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">{t('bet.status')}</span>
                        <div className={`flex items-center gap-1 sm:gap-2 ${bet.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                            {bet.isWinner ?
                                <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> :
                                <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            }
                            {bet.isWinner ? t('bet.won') : t('bet.lost')}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const LoadingState = () => (
    <Container className="bg-secondary-game w-fit rounded-xl relative flex flex-col pt-16 sm:pt-24 gap-6 items-center min-h-screen">
        <div className="flex justify-center py-8">
            <Timer className="h-6 w-6 animate-spin" />
        </div>
    </Container>
);

const ErrorState = ({ message }: { message: string }) => (
    <Container className="bg-secondary-game w-fit rounded-xl relative flex flex-col pt-16 sm:pt-24 gap-6 items-center min-h-screen">
        <div className="text-center py-8 text-red-500 px-4">
            {message}
        </div>
    </Container>
);

const RoundDetailPage = () => {
    const t = useTranslations('round-detail');
    const params = useParams();
    const roundId = params.id as string;

    const {
        data: roundData,
        isLoading: isLoadingRound,
        isError: isRoundError,
    } = useGetRoundRecordById(Number(roundId));

    const {
        data: betsData,
        isLoading: isLoadingBets,
        isError: isBetsError,
    } = useRoundBets(roundId);

    if (isLoadingRound || isLoadingBets) {
        return <LoadingState />;
    }

    if (isRoundError || !roundData) {
        return <ErrorState message={t('errors.round-load-failed')} />;
    }

    if (isBetsError || !betsData) {
        return <ErrorState message={t('errors.bets-load-failed')} />;
    }

    const round = new RoundRecord(roundData.data);
    const bets = betsData.data;

    return (
        <Container className="bg-primary-game w-fit rounded-xl relative flex flex-col pt-16 sm:pt-24 gap-4 sm:gap-6 items-center min-h-screen">
            <TopBar>
                <h1 className="text-lg sm:text-xl font-semibold">{t('title', { roundId: round.id })}</h1>
            </TopBar>

            <section className="container-main w-full max-w-6xl px-3 sm:px-4 md:px-6">
                <Card className="bg-tertiary border-[#EFF8FF17] mb-6 sm:mb-8">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="text-white text-lg sm:text-xl">{t('round.details')}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-white text-sm sm:text-base">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400 text-xs sm:text-sm">{t('round.start-time')}</p>
                                        <p>{dayjs(round.startTime).format('DD MMM YYYY, HH:mm:ss')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400 text-xs sm:text-sm">{t('round.end-time')}</p>
                                        <p>{dayjs(round.endTime).format('DD MMM YYYY, HH:mm:ss')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400 text-xs sm:text-sm">{t('round.winner')}</p>
                                        <p className="font-semibold">{round.winnerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <div>
                                        <p className="text-gray-400 text-xs sm:text-sm">{t('round.type')}</p>
                                        <p className="capitalize">{round.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <RoundResult roundRecordId={Number(roundId)} />
                <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 px-1">{t('bets.title')}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {bets.map((bet: Bet) => (
                            <BetCard key={bet.id} bet={bet} />
                        ))}
                    </div>
                </div>
            </section>
        </Container>
    );
};

export default RoundDetailPage;