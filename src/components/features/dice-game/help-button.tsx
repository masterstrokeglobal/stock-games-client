import { Button } from "@/components/ui/button";
import BettingHistoryDialog from "./betting-history";
import HowToPlayDialog from "./how-to-play";
import Link from "next/link";

const HelpButton = () => {
    return (
        <div className="space-y-2">
            <BettingHistoryDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 dice-header ">
                    Betting History
                </Button>
            </BettingHistoryDialog>
            <HowToPlayDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 dice-header ">
                    How to Play?
                </Button>
            </HowToPlayDialog>
            <HowToPlayDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 dice-header ">
                    Demo Video
                </Button>
            </HowToPlayDialog>
            <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 dice-header ">
                <Link href="/game/contact" className="w-full h-full ">
                    Support
                </Link>
            </Button>
        </div>
    );
};

export default HelpButton;
