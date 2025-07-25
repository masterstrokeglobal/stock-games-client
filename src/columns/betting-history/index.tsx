import { RoundRecordGameType } from "@/models/round-record";
import diceGameColumns from "./dice-game-columns";
import stockSlotColumns from "./stock-slot-columns";
import wheelOfFortuneColumns from "./wheel-of-fortune-columns";
import headTailColumns from "./head-tail-columns";
import derbyColumns from "./derby-columns";
import { ColumnDef } from "@tanstack/react-table";
import stockJackpotColumns from "./stock-jackpot";
import sevenUpDownColumns from "./seven-up-down-columns";
import aviatorColumns from "./aviator-columns";

export const getHistoryColumns = (gameType: RoundRecordGameType): ColumnDef<any>[] => {
    switch (gameType) {
        case RoundRecordGameType.DICE:
            return diceGameColumns;
        case RoundRecordGameType.WHEEL_OF_FORTUNE:
            return wheelOfFortuneColumns;
        case RoundRecordGameType.STOCK_SLOTS:
            return stockSlotColumns;
        case RoundRecordGameType.STOCK_JACKPOT:
            return stockJackpotColumns;
        case RoundRecordGameType.HEAD_TAIL:
            return headTailColumns;
        case RoundRecordGameType.DERBY:
            return derbyColumns;
        case RoundRecordGameType.SEVEN_UP_DOWN:
            return sevenUpDownColumns;
        case RoundRecordGameType.AVIATOR:
            return aviatorColumns;

        default:
            return derbyColumns;
    }
}   