import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface GameCardProps {
    title: string
    image: string
    players: string
    category: string
}

export default function GameCard({ title, image, players, category }: GameCardProps) {
    return (
        <Card className="overflow-hidden bg-background text-game-text border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-40 w-full">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            </div>
            <CardContent className="p-4 bg-primary-game">
                <h3 className="font-bold text-lg mb-1 text-game-secondary">{title}</h3>
                <div className="flex justify-between text-xs text-game-secondary mb-3">
                    <span>{players}</span>
                    <span>{category}</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-bet-button-start via-bet-button-mid to-bet-button-end text-white border border-bet-button-border hover:opacity-90">
                    Play Now
                </Button>
            </CardContent>
        </Card>
    )
}
