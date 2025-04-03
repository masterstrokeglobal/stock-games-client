import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"; // Assuming a carousel component is available
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useGetAdvertisements } from "@/react-query/advertisment-queries";
import { Advertisement } from "@/models/advertisment";
import Link from "next/link";

const AdvertismentDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isSuccess } = useGetAdvertisements();
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    const advertisments = useMemo(() => {
        if (isSuccess) {
            return Array.from(data?.data.companyBanners).map((banner) => new Advertisement(banner as Advertisement)).filter((ad) => ad.active)
        }
        return []
    }, [data, isSuccess])

    useEffect(() => {
        const hasSeenAdvertisment = sessionStorage.getItem('hasSeenAdvertisment');
        if (!hasSeenAdvertisment && advertisments.length > 0) {
            setIsOpen(true);
            sessionStorage.setItem('hasSeenAdvertisment', 'true');
        }
    }, [advertisments]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent showButton={false} className="bg-primary-game border-none dark">
                <Button className="absolute top-2 right-2 border-none z-10 " variant="ghost" onClick={() => setIsOpen(false)}>
                    <XIcon className="w-4 h-4 text-white" />
                </Button>
                <DialogTitle className="sr-only">Advertisment</DialogTitle>
                <div className="flex flex-col gap-4 w-full min-h-96 h-auto">
                    <Carousel plugins={[plugin.current]}
                        className="w-full "
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}>
                        <CarouselContent>
                            {advertisments.map((ad, index) => (
                                <CarouselItem key={index} className="w-full">
                                    <Link href={ad.link ?? '#'} target="_blank">
                                        <img key={index} src={ad.image} alt={ad.name} className="w-full h-auto object-cover" />
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog >
    );
}

export default AdvertismentDialog;