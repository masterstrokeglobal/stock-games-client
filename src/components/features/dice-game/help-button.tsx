import { Button } from "@/components/ui/button";
import BettingHistoryDialog from "./betting-history";
import DemoVideoDialog from "./demo-video";
import GameHistoryDialog from "./game-history";
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
            <GameHistoryDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                    Game History
                </Button>
            </GameHistoryDialog>
        </div>
    );
};

export default HelpButton;
