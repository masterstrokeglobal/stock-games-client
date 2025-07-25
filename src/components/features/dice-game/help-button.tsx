import { Button } from "@/components/ui/button";
import BettingHistoryDialog from "./betting-history";
import HowToPlayDialog from "./how-to-play";
import Link from "next/link";
import DemoVideoDialog from "./demo-video";

const HelpButton = (
    { externalUser = false }: { externalUser?: boolean }
) => {
    return (
        <div className="space-y-2">
            {!externalUser && (
                <BettingHistoryDialog>
                    <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white     dice-header ">
                        Betting History
                    </Button>
                </BettingHistoryDialog>
            )}
            <HowToPlayDialog>
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                    Game Rules
                </Button>
            </HowToPlayDialog>
            <DemoVideoDialog    >
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                    Demo Video
                </Button>
            </DemoVideoDialog>
            {!externalUser && (
                <Button className="w-full h-11 bg-[#0C309E] hover:bg-[#0C309E]/80 text-white dice-header ">
                    <Link href="/game/contact" className="w-full h-full flex items-center justify-center">
                        Support
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default HelpButton;
