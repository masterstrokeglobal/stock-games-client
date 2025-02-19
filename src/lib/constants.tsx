import { LobbyGameType } from "@/models/lobby";
import { Coins, Hash, TrendingDown, TrendingUp } from "lucide-react";

export const LOBBY_GAMES = [
    {
        title: "Guess First Four",
        gameType: LobbyGameType.GUESS_FIRST_FOUR,
        description: "Select a stock you think will be among the top 4 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 4 positions",
        ],
        icon: <TrendingUp className="h-8 w-8 mb-2" />,
        color: "from-green-600 to-green-400"
    },
    {
        title: "Guess Last Four",
        gameType: LobbyGameType.GUESS_LAST_FOUR,
        description: "Select a stock you think will be among the bottom 4 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 4 positions",
        ],
        icon: <TrendingDown className="h-8 w-8 mb-2" />,
        color: "from-red-600 to-red-400"
    },
    {
        title: "Guess First Eight",
        gameType: LobbyGameType.GUESS_FIRST_EIGHT,
        description: "Select a stock you think will be among the top 8 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 8 positions",
        ],
        icon: <Hash className="h-8 w-8 mb-2" />,
        color: "from-blue-600 to-blue-400"
    },
    {
        title: "Guess Last Eight",
        gameType: LobbyGameType.GUESS_LAST_EIGHT,
        description: "Select a stock you think will be among the bottom 8 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 8 positions",
        ],
        icon: <Hash className="h-8 w-8 mb-2" />,
        color: "from-purple-600 to-purple-400"
    },
    {
        title: "Guess Higher",
        gameType: LobbyGameType.GUESS_HIGHER,
        description: "Predict if a stock will increase in value over the trading window",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock's price increases",
        ],
        icon: <TrendingUp className="h-8 w-8 mb-2" />,
        color: "from-yellow-600 to-yellow-400"
    },
    {
        title: "Mini Mutual Fund",
        gameType: "mutual-fund",
        description: "Create a small portfolio and compete with other players",
        rules: [
            "Select multiple stocks",
            "2-minute trading window",
            "Portfolio performance determines winnings",
        ],
        icon: <Coins className="h-8 w-8 mb-2" />,
        color: "from-orange-600 to-orange-400"
    }
] as const;
