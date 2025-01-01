"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGetTopPlacements } from "@/react-query/game-record-queries";
import { RoundRecord } from "@/models/round-record";
import GameRecord, { PlacementType } from "@/models/game-record";

type Props = {
    className?: string;
    round: RoundRecord;
};

const CurrentBets = ({ className, round }: Props) => {
    const { data, isSuccess } = useGetTopPlacements(round.id.toString());

    const currentBetsData: GameRecord[] = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return [];
    }, [isSuccess, data]);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
        }
    }, []);


    const getPlacementString = (bet: GameRecord) => {

        const HorseNumbers = bet.market.map((number) => {
            const horseNumber = round.market.find((market) => market.id === number)?.horse;
            return horseNumber || 0;
        }).sort((a, b) => a - b);

        switch (bet.placementType) {

            case PlacementType.SINGLE:
                return `Single ${HorseNumbers[0]}`;
            case PlacementType.SPLIT:
                return `Split ${HorseNumbers[0]}-${HorseNumbers[1]}`;
            case PlacementType.QUARTER:
                return `Quarter ${HorseNumbers[0]} ${HorseNumbers[1]} ${HorseNumbers[2]} ${HorseNumbers[3]}`;
            case PlacementType.STREET:
                // first and last number of the street
                return `Street ${HorseNumbers[0]}-${HorseNumbers[HorseNumbers.length - 1]}`;
            case PlacementType.DOUBLE_STREET:
                // first and last number of the street
                return `DOUBLE STREET ${HorseNumbers[0]} - ${HorseNumbers[HorseNumbers.length - 1]}`;
            case PlacementType.CORNER:
                return `Corner ${HorseNumbers[0]} ${HorseNumbers[1]} ${HorseNumbers[2]} ${HorseNumbers[3]}`;
            case PlacementType.COLUMN:
                return `Column ${HorseNumbers[0]} ${HorseNumbers[HorseNumbers.length -1]}`;
            case PlacementType.COLOR:
                // show color
                return `${HorseNumbers[0]==1 ? 'Red' : 'Black'}`;

            case PlacementType.EVEN_ODD:
                // calculate if even or odd
                return `${HorseNumbers[0] % 2 === 0 ? 'Even' : 'Odd'}`;
            case PlacementType.HIGH_LOW:
                // first and last number of the high low
                return `DOUBLE STREET ${HorseNumbers[0]} - ${HorseNumbers[HorseNumbers.length - 1]}`;

            default:
                return '-';

        }
    }

    return (
        <section
            ref={sectionRef}
            className={cn("p-4 rounded-2xl h-full w-full bg-[#122146]", className)}
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Current Bets
            </h2>
            <ScrollArea className="max-h-96 w-full" style={{ height: `${scrollAreaHeight - 20}px` }} type="auto">
                {currentBetsData.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr className="flex">
                                <th className="p-2 text-sm text-left text-gray-300 rounded-tl-lg flex-1">
                                    Crypto
                                </th>
                                <th className="p-2 text-sm text-left text-gray-300 flex-1">
                                    User ID
                                </th>
                                <th className="p-2 text-sm text-right text-gray-300 rounded-tr-lg flex-1">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBetsData.map((bet: any, index: number) => (
                                <tr
                                    key={index}
                                    className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <td className="p-2 text-sm text-gray-300 rounded-l-lg flex-1">
                                        {getPlacementString(bet)}
                                    </td>
                                    <td className="p-2 text-sm text-gray-300 flex-1">
                                        {bet.user.username}
                                    </td>
                                    <td className="p-2 text-sm text-right text-gray-300 rounded-r-lg flex-1">
                                        {bet.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-300 py-4">
                        No bets found
                    </div>
                )}
            </ScrollArea>
        </section>
    );
};

export default CurrentBets;
