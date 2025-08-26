import { Button } from "@/components/ui/button";
import GameSettingsPopover from "./game-menu";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = PropsWithClassName<{
    title: string;
}>;
const RouletteGameHeader = ({ title, className }: Props) => {
    return (
        <header id="roulette-game-header" className={cn('text-center md:px-6 px-4  relative h-16 flex justify-between items-center  ', className)}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <GameSettingsPopover>
                <Button size="icon" className="bg-[#008CB3]">
                    <MenuIcon />
                </Button>
            </GameSettingsPopover>
        </header>
    );
}

export default RouletteGameHeader;