import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Lobby } from "@/models/lobby";
import { MessageCircle } from "lucide-react";
import LobbyChatSection from './lobby-chat';
import { cn } from "@/lib/utils";

interface LobbyChatSectionProps {
    lobby: Lobby;
    onSend: (message: string) => void;
    className?: string;
}

const LobbyChatSheet = ({ lobby, onSend,className }: LobbyChatSectionProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("relative hover:bg-gray-800/50",className)}
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
                    className="h-full"
                />
            </SheetContent>
        </Sheet>
    );
};

export default LobbyChatSheet;