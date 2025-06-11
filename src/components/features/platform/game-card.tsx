import { Card, CardContent } from "@/components/ui/card"
import { Game } from "@/lib/constants"
import Image from "next/image"
import Link from "next/link";

interface GameCardProps {
    game: Game
}

export default function GameCard({ game }: GameCardProps) {
    const { title, image, description } = game;
    return (
        <Link href={game.link} className="w-full">
            <Card className="overflow-hidden relative  h-72 from-white to-primary-game text-game-text border-none hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className=" h-full absolute w-full">
                    <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            </div>
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary-game to-transparent"></div>
            <CardContent className="px-0 z-10  bottom-0 absolute w-full ">
                <h3 className="font-bold text-lg mb-2 text-game-text px-4 bg-white">{title}</h3>
                <div className="flex px-4 justify-between text-xs text-game-secondary">
                    <span>{description}</span>
                </div>

            </CardContent>
        </Card>
        </Link>
    )
}
