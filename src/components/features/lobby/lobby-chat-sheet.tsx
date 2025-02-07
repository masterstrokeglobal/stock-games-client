import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Lobby } from "@/models/lobby";
import { MessageCircle } from "lucide-react";
import LobbyChatSection from './lobby-chat';

interface LobbyChatSectionProps {
    lobby: Lobby;
    onSend: (message: string) => void;
}

const LobbyChatSheet = ({ lobby, onSend }: LobbyChatSectionProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-800/50"
                >
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    {/* Optional: Add unread messages indicator */}
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className='w-screen p-0 pt-8  bg-gray-950 border-gray-900'
            >
                <LobbyChatSection
                    lobbyId={lobby!.id!}
                    onSend={onSend}
                />
            </SheetContent>
        </Sheet>
    );
};

export default LobbyChatSheet;