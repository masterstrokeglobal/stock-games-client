import { Button } from "@/components/ui/button";
import GameSettingsPopover from "./game-menu";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import GameHeaderMobile from "./roulette-mobile-header";

type Props = PropsWithClassName<{
    title: string;
    isMobile?: boolean;
    roundRecord?: RoundRecord;
}>;
const RouletteGameHeader = ({ title, className, isMobile, roundRecord }: Props) => {
    return (
        <header id="roulette-game-header" className={cn('text-center md:px-6 px-4  relative h-16 flex justify-between items-center  ', className)}>
            <h2 className="text-xl font-semibold">{title}</h2>
          
            {isMobile && roundRecord && (
                <GameHeaderMobile className="ml-auto" roundRecord={roundRecord} />
            )}
              <GameSettingsPopover>
                <Button size="icon" className="bg-[#008CB3] ml-2">
                    <MenuIcon />
                </Button>
            </GameSettingsPopover>
          
        </header>
    );
}

export default RouletteGameHeader;