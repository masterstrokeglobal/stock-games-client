import { Button } from "@/components/ui/button";
import GameSettingsPopover from "./game-menu";
import { MenuIcon } from "lucide-react";

const RouletteGameHeader = () => {
    return (
        <header className='text-center px-6  relative h-16 flex justify-between items-center  '>
            <h2 className="text-xl font-semibold">Stock Roulette</h2>
            <GameSettingsPopover>
                <Button size="icon" className="bg-[#008CB3]">
                    <MenuIcon />
                </Button>
            </GameSettingsPopover>
        </header>
    );
}

export default RouletteGameHeader;