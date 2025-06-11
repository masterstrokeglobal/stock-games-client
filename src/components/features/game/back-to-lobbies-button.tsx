import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/use-current-game";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import Link from "next/link";

type Props = {
    className?: string;
}

const BackToLobbiesButton = ({ className }: Props) => {
    const { lobby, lobbyRound } = useGameStore();

    const { isGameOver } = useGameState(lobbyRound?.roundRecord ?? null);

    if (isGameOver) return (
        <div className={cn("flex justify-center px-4 py-4", className)}>
        <Link href={`/game/lobby/${lobby?.joiningCode}`} className="w-full"><Button variant="game" className="w-full">Go to Lobby</Button></Link>
        </div>
    );

    return null;
};

export default BackToLobbiesButton;