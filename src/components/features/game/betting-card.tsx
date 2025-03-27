import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GameRecord from "@/models/game-record";
import dayjs from "dayjs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const BettingCard = ({ record }: { record: GameRecord }) => {

    /*     const getPlacementString = (bet: GameRecord) => {
    
            const HorseNumbers = bet.market.map((number) => {
                const horseNumber = bet.market.find((market) => market === number);
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
                    return `Column ${HorseNumbers[0]} ${HorseNumbers[HorseNumbers.length - 1]}`;
                case PlacementType.COLOR:
                    // show color
                    return `${HorseNumbers[0] == 1 ? 'Red' : 'Black'}`;
    
                case PlacementType.EVEN_ODD:
                    // calculate if even or odd
                    return `${HorseNumbers[0] % 2 === 0 ? 'Even' : 'Odd'}`;
                case PlacementType.HIGH_LOW:
                    // first and last number of the high low
                    return `DOUBLE STREET ${HorseNumbers[0]} - ${HorseNumbers[HorseNumbers.length - 1]}`;
    
                default:
                    return '-';
    
            }
        } */
    return (
        <Card className="w-full bg-gray-900 border-gray-800 text-white rounded-lg shadow-md ">
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <div className="space-y-2 w-full">
                        <p className="text-sm text-gray-400">
                            {dayjs(record?.createdAt).format('DD MMM YYYY, h:mm A')}
                        </p>
                        <p className="text-xl font-semibold capitalize">
                            {record.placementType.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-400 flex justify-between items-center w-full">
                            <span className="flex items-center gap-2">
                                Round #{record.round?.id}
                            </span>
                            <Badge className="ml-auto" variant={record.round?.type === 'crypto' ? 'secondary' : 'success'}>
                                {record.round?.type}
                            </Badge>
                        </p>
                    </div>
                </div>
                <div className="text-left flex gap-2">
                    <div className="flex items-center gap-2 justify-between w-full">
                        <span className="text-2xl font-bold">
                            Rs. {record.amount.toFixed(2)}
                        </span>
                    </div>

                    <p className={`text-sm flex items-center gap-2 mt-2 ${record.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                        {record.isWinner ? (
                            <ArrowUpCircle className="w-6 h-6 text-green-400" />
                        ) : (
                            <ArrowDownCircle className="w-6 h-6 text-red-400" />
                        )}
                        {record.isWinner ? 'Won' : 'Lost'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default BettingCard;

