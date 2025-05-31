import { LobbyGameType } from "@/models/lobby";

export const LOBBY_GAMES : Game[] = [
    {
        title: "Guess First Four",
        gameType: LobbyGameType.GUESS_FIRST_FOUR,
        link: `/game/lobby?gameType=${LobbyGameType.GUESS_FIRST_FOUR}`,
        description: "Select a stock you think will be among the top 4 performers play against other players",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 4 positions",
        ],
        image: "/images/games/guess-first-four.png",
        color: "from-green-600 to-green-400"
    },
    {
        title: "Guess Last Four",
        gameType: LobbyGameType.GUESS_LAST_FOUR,
        link: `/game/lobby?gameType=${LobbyGameType.GUESS_LAST_FOUR}`,
        description: "Select a stock you think will be among the bottom 4 performers play against other players     ",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 4 positions",
        ],
        image: "/images/games/guess-last-four.png",
        color: "from-red-600 to-red-400"
    },
    {
        title: "Guess First Eight",
        gameType: LobbyGameType.GUESS_FIRST_EIGHT,
        link: `/game/lobby?gameType=${LobbyGameType.GUESS_FIRST_EIGHT}`,
        description: "Select a stock you think will be among the top 8 performers play against other players",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 8 positions",
        ],
        image: "/images/games/guess-first-eight.png",
        color: "from-blue-600 to-blue-400"
    },
    {
        title: "Guess Last Eight",
        gameType: LobbyGameType.GUESS_LAST_EIGHT,
        link: `/game/lobby?gameType=${LobbyGameType.GUESS_LAST_EIGHT}`,
        description: "Select a stock you think will be among the bottom 8 performers play against other players",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 8 positions",
        ],
        image: "/images/games/guess-last-eight.png",
        color: "from-purple-600 to-purple-400"
    },
    {
        title: "Guess Higher",
        gameType: LobbyGameType.GUESS_HIGHER,
        link: `/game/lobby?gameType=${LobbyGameType.GUESS_HIGHER}`,
        description: "Predict if a stock will increase in value over the trading window play against other players",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock's price increases",
        ],
        image: "/images/games/guess-higher.png",
        color: "from-yellow-600 to-yellow-400"
    },
    {
        title: "Mini Mutual Fund",
        gameType: LobbyGameType.MINI_MUTUAL_FUND,
        rules: [
            "Choose 4 stocks to create a portfolio",
            "2-minute trading window",
            "Win if your portfolio's value increases",
        ],
        link: `/game/lobby?gameType=${LobbyGameType.MINI_MUTUAL_FUND}`,
        image: "/images/games/mini-mutual-fund.png",
        description: "Create a small portfolio and compete with other players play against other players",
    },
] as const;


export const StockDerbyGames : Game[] = [
    {
        title: "NSE Market",
        link: "/game?gameType=nse",
        image: "/images/nse.png",
        description: "Rouletter game on live NSE stocks",
    },
    {
        title: "Crypto Market",
        link: "/game?gameType=crypto",
        image: "/images/crypto.png",
        description: "Rouletter game on live crypto currencies",
    },
    {
        title: "US Market",
        link: "/game?gameType=usa_market",
        image: "/images/us-stock.png",
        description: "Rouletter game on live US stocks",
    },
    {
        title: "Stock Jackpot",
        link: "/game/jackpot",
        image: "/images/ad1.webp",
        description: "Guess Price Movement"
    },
    {

        title: "Stock Slot",
        link: "/game/platform/stock-game/stock-slot",
        image: "/images/ad3.png",
        description: "Guess Last Price Digit and win"
    },

    // 7 up down
    {
        title: "7 Up Down",
        link: "/game/platform/stock-game/7-up-7-down",
        image: "/images/banner/7-up.png",
        description: "14 stocks choosing will more than 7 go up or down"
    }
,
    // coin head tail
    {
        title: "Coin Head Tail",
        link: "/game/platform/stock-game/coin-head-tail",
        image: "/images/banner/coin-toss.png",
        description: "Guess the side of the coin"
    }
    , 
    {
        title: "Wheel of Fortune",
        link: "/game/platform/stock-game/wheel-of-fortune",
        image: "/images/banner/wheel-of-fortune.png",
        description: "Guess the side of the coin"
    }
    ,
    {
        title: "Dice Game",
        link: "/game/platform/stock-game/dice-game",
        image: "/images/banner/dice-game.png",
        description: "Guess the side of the coin"
    }

   
]

export const SinglePlayerGames : Game[] = [
    {
        title: "Guess First Four",
        gameType: LobbyGameType.GUESS_FIRST_FOUR,
        link: `/game/single-player?roundRecordGameType=${LobbyGameType.GUESS_FIRST_FOUR}`,
        description: "Select a stock you think will be among the top 4 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 4 positions",
        ],
        image: "/images/games/guess-first-four.png",
        color: "from-green-600 to-green-400"
    },
    {
        title: "Guess Last Four",
        gameType: LobbyGameType.GUESS_LAST_FOUR,
        link: `/game/single-player?roundRecordGameType=${LobbyGameType.GUESS_LAST_FOUR}`,
        description: "Select a stock you think will be among the bottom 4 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 4 positions",
        ],
        image: "/images/games/guess-last-four.png",
        color: "from-red-600 to-red-400"
    },
    {
        title: "Guess First Eight",
        gameType: LobbyGameType.GUESS_FIRST_EIGHT,
        link: `/game/single-player?roundRecordGameType=${LobbyGameType.GUESS_FIRST_EIGHT}`,
        description: "Select a stock you think will be among the top 8 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in top 8 positions",
        ],
        image: "/images/games/guess-first-eight.png",
        color: "from-blue-600 to-blue-400"
    },
    {
        title: "Guess Last Eight",
        gameType: LobbyGameType.GUESS_LAST_EIGHT,
        link: `/game/single-player?roundRecordGameType=${LobbyGameType.GUESS_LAST_EIGHT}`,
        description: "Select a stock you think will be among the bottom 8 performers",
        rules: [
            "Choose from 16 available stocks",
            "2-minute trading window",
            "Win if your stock finishes in bottom 8 positions",
        ],
        image: "/images/games/guess-last-eight.png",
        color: "from-purple-600 to-purple-400"
    },
    {
        title: "Mini Mutual Fund",
        link: `/game/single-player/mini-mutual-fund`,
        image: "/images/games/mini-mutual-fund.png",
        description: "Create a small portfolio and compete with other players",
    },
    {
        title: "7up Down",
        link: "/game/platform/stock-game/7-up-7-down",
        image: "/images/games/7-up.png",
        description: "14 stocks choosing will more than 7 go up or down"
    },
    {
        title: "Coin Head Tail",
        link: "/game/platform/stock-game/coin-head-tail",
        image: "/images/games/coin-head-tail.png",
        description: "Guess the side of the coin"
    }

]



export type Game = {
    title: string;
    gameType?: LobbyGameType;
    link: string;
    image: string;
    description: string;
    rules?: string[];
    color?: string;
}
