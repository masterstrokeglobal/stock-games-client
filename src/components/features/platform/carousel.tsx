"use client"

import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { Advertisement, AdvertisementType } from "@/models/advertisment"
import { useGetAdvertisements } from "@/react-query/advertisment-queries"

interface HeroCarouselProps {
  autoPlayInterval?: number
  className?: string
}

export function GameAdsCarousel({ autoPlayInterval = 5000, className }: HeroCarouselProps) {

  const { data, isSuccess, isFetching } = useGetAdvertisements({
    type: AdvertisementType.SLIDER,
    search: "",
    page: 1,
    limit: 10,
  });

  const advertisements = useMemo(() => {
    if (isSuccess && data?.data?.companyBanners) {
      return Array.from(data.data.companyBanners).map(
        (item: any) => new Advertisement(item)
      );
    }
    return [];
  }, [data, isSuccess]);
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || isHovering) return

    const intervalId = setInterval(() => {
      api.scrollNext()
    }, autoPlayInterval)

    return () => clearInterval(intervalId)
  }, [api, autoPlayInterval, isHovering])

  if (isFetching) {
    return (
      <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
        <Skeleton className="w-full h-full bg-background-secondary" />
      </div>
    )
  }

  return (
    <Carousel
      setApi={setApi}
      className={cn("relative rounded-lg overflow-hidden", className)}
      opts={{ loop: true }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CarouselContent className="h-[300px] md:h-[400px]">
        {advertisements.map((advertisement) => (
          <CarouselItem key={advertisement.id}>
            <div
              className={cn(
                "relative w-full h-full",
              )}
              style={{
                backgroundImage: advertisement.image ? `url(${advertisement.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        className="absolute left-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 p-0 text-white hover:bg-[#ff0066]/80 transition-colors"
      />
      <CarouselNext
        className="absolute right-4 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 p-0 text-white hover:bg-[#ff0066]/80 transition-colors"
      />

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-8 rounded-full transition-all",
              current === index ? "bg-[#ff0066]" : "bg-white/50 hover:bg-white/80",
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index}
          />
        ))}
      </div>
    </Carousel>
  )
}