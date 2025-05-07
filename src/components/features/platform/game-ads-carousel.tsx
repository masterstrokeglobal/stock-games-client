"use client"

import { cn } from "@/lib/utils"
import { Advertisement, AdvertisementType } from "@/models/advertisment"
import { useGetAdvertisements } from "@/react-query/advertisment-queries"
import * as React from "react"
import { useEffect, useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface HeroCarouselProps {
  autoPlayInterval?: number
  className?: string
}

export function GameAdsCarousel({ autoPlayInterval = 5000, className }: HeroCarouselProps) {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const { data } = useGetAdvertisements({
    page: 1,
    limit: 10,
    search: "",
    active: "true",
    type: AdvertisementType.SLIDER,
  })

  const advertisements = React.useMemo(() => {
    if (data?.data?.companyBanners) {
      return Array.from(data.data.companyBanners).map(
        (item: any) => new Advertisement(item)
      )
    }
    return []
  }, [data])

  // Calculate how many slides to show based on total slides available
  const totalSlides = advertisements.length
  const slidesToShowDesktop = Math.min(3, totalSlides)
  const slidesToShowTablet = Math.min(2, totalSlides)

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

  // Helper to get active slides for indicators
  const getVisibleSlideIndices = () => {
    if (!api) return [current]

    // Get the current index
    const currentIndex = api.selectedScrollSnap()
    const visibleIndices = [currentIndex]

    // Add adjacent indices based on viewport
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0

    if (windowWidth >= 1024) { // Desktop
      for (let i = 1; i < slidesToShowDesktop; i++) {
        visibleIndices.push((currentIndex + i) % totalSlides)
      }
    } else if (windowWidth >= 640) { // Tablet
      if (slidesToShowTablet > 1) {
        visibleIndices.push((currentIndex + 1) % totalSlides)
      }
    }

    return visibleIndices
  }

  if (!advertisements.length) return null

  return (
    <Carousel
      setApi={setApi}
      className={cn("relative rounded-lg overflow-hidden", className)}
      opts={{
        loop: true,
        align: "start",
        containScroll: "trimSnaps"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CarouselContent className="h-[250px] -ml-2 md:-ml-4">
        {advertisements.map((ad) => (
          <CarouselItem
            key={ad.id}
            className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 h-[250px]"
          >
            <div
              className="relative w-full h-full rounded-lg overflow-hidden"
              style={{
                backgroundImage: ad.image ? `url(${ad.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        className="absolute left-2 md:left-4 top-1/2 z-20 h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 rounded-full bg-black/30 p-0 text-white hover:bg-[#ff0066]/80 transition-colors"
      />
      <CarouselNext
        className="absolute right-2 md:right-4 top-1/2 z-20 h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 rounded-full bg-black/30 p-0 text-white hover:bg-[#ff0066]/80 transition-colors"
      />

      {/* Indicators */}
      <div className=" mt-4 mx-auto space-x-2 flex justify-center">
        {advertisements.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 md:h-2 w-6 md:w-8 rounded-full transition-all",
              current === index || (api && getVisibleSlideIndices().includes(index))
                ? "bg-[#ff0066]"
                : "bg-white/50 hover:bg-white/80",
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index}
          />
        ))}
      </div>
    </Carousel>
  )
}