import { useEffect, useState } from 'react';

// Import shadcn/ui carousel components
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from '@/components/ui/carousel';

type Props = {
    autoplayInterval?: number; // Time in ms between slides
};

export default function CasinoCarousel({ autoplayInterval = 5000 }: Props): JSX.Element {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [screenHeight, setScreenHeight] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Images to display in the carousel
    const images = [
        '/images/ad1.png',
        '/images/ad2.png'
    ];

    // Track screen dimensions for responsive image sizing
    useEffect(() => {
        const updateScreenDimensions = () => {
            // Calculate available height (subtract some space for potential margins)
            const calculatedHeight = window.innerHeight * 0.8; // Use 80% of viewport height
            setScreenHeight(calculatedHeight);
            
            // Check if device is mobile (width less than 768px)
            setIsMobile(window.innerWidth < 768);
        };
        
        updateScreenDimensions();
        window.addEventListener('resize', updateScreenDimensions);
        
        return () => {
            window.removeEventListener('resize', updateScreenDimensions);
        };
    }, []);

    // Set up carousel API and tracking
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

    // Set up autoplay
    useEffect(() => {
        if (!api || autoplayInterval <= 0) return;
        
        const interval = setInterval(() => {
            api.scrollNext();
        }, autoplayInterval);
        
        return () => clearInterval(interval);
    }, [api, autoplayInterval]);

    // For desktop view, we show both images side by side
    if (!isMobile) {
        return (
            <div className="w-full p-0">
                <div className="flex w-full">
                    {images.map((image, index) => (
                        <div 
                            key={index} 
                            className="w-1/2 flex justify-center items-center overflow-hidden px-1"
                        >
                            <img
                                src={image}
                                alt={`Advertisement ${index + 1}`}
                                className="w-full h-auto object-contain"
                                style={{
                                    maxHeight: screenHeight ? `${screenHeight}px` : '80vh'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // For mobile view, we use the carousel to show one image at a time
    return (
        <div className="w-full p-0">
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="py-0">
                    {images.map((image, index) => (
                        <CarouselItem
                            key={index}
                            className="p-0 w-full"
                        >
                            <div className="w-full flex justify-center items-center overflow-hidden">
                                <img 
                                    src={image}
                                    alt={`Advertisement ${index + 1}`}
                                    className="w-full h-auto object-contain"
                                    style={{
                                        maxHeight: screenHeight ? `${screenHeight}px` : '80vh'
                                    }}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Simple dot indicators for position reference (mobile only) */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                            index === current ? "bg-blue-500" : "bg-gray-400 opacity-50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}