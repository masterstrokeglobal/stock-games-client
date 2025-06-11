
// Import shadcn/ui carousel components
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Game } from '@/lib/constants';
import GameCard from './game-card';



type Props = {
    games: Game[];
    title: string;
}

export default function CasinoCarousel({ games, title }: Props): JSX.Element {


    return (
        <Carousel className="w-full  p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-2xl font-bold ">{title}</h2>
                <div className="flex gap-2">
                    <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                    <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                </div>
            </div>

            <div className="w-full border-t-2 border-blue-400 opacity-20 mb-4">
                <div className="w-full h-full bg-gradient-to-r from-primary-game to-transparent"></div>
            </div>

        
                <CarouselContent className="-ml-4 py-4">
                    {games.map((game) => (
                        <CarouselItem
                            key={game.title}
                            className="pl-4"
                            style={{ width: '320px', flexBasis: '320px' }}
                        >
                            <GameCard game={game} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

        </Carousel>
    );
}