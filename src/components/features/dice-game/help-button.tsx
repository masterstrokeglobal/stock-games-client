import { Button } from "@/components/ui/button";
import BettingHistoryDialog from "./betting-history";
import HowToPlayDialog from "./how-to-play";
import Link from "next/link";
import DemoVideoDialog from "./demo-video";
import GameRules from "./game-rules";

const HelpButton = () => {
    return (
        <div className="space-y-2">
            <BettingHistoryDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white     dice-header ">
                    Betting History
                </Button>
            </BettingHistoryDialog>
            <GameRules>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                Game Rules
                </Button>
            </GameRules>
            <DemoVideoDialog    >
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                    Demo Video
                </Button>
            </DemoVideoDialog>
            <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                <Link href="/game/platform/contact" className="w-full h-full flex items-center justify-center">
                    Support
                </Link>
            </Button>
        </div>
    );
};

export default HelpButton;
