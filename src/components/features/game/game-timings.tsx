"use client";
import { useGameType } from "@/hooks/use-game-type";
import { SchedulerType } from "@/models/market-item";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const GameTimings = () => {
    const t = useTranslations("common");
    const [gameType] = useGameType();
    const pathname = usePathname();

    const isNSE = gameType === SchedulerType.NSE && pathname == "/game";
    const isUSAMarket = gameType === SchedulerType.USA_MARKET && pathname == "/game";

    return (
        <>
            {isNSE && <div className="items-center hidden md:flex space-x-4 ml-auto">
                <span className="text-sm text-game-secondary">{t("timings")}</span>
            </div>}
            {isUSAMarket && <div className="items-center hidden md:flex space-x-4 ml-auto">
                <span className="text-sm text-game-secondary">{t("usa-timings")}</span>
            </div>}
        </>
    )
}

export default GameTimings;