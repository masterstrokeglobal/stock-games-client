import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import shadcn/ui carousel components
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel';
import { Game } from '@/lib/constants';
import GameCard from './game-card';



type Props = {
    games: Game[];
    title: string;
}

export default function CasinoCarousel({ games, title }: Props): JSX.Element {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    console.log(count, current);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);

        const onSelect = (): void => {
            setCurrent(api.selectedScrollSnap());
        };

        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    return (
        <div className="w-full  p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-2xl font-bold ">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => api?.scrollPrev()}
                        className="bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => api?.scrollNext()}
                        className="bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="w-full border-t-2 border-blue-400 opacity-20 mb-4">
                <div className="w-full h-full bg-gradient-to-r from-primary-game to-transparent"></div>
            </div>

            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
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

                {/* Hidden built-in navigation buttons as we're using custom ones above */}
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
            </Carousel>
        </div>
    );
}