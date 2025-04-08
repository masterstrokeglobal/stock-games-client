import { Button } from "@/components/ui/button"

interface FeaturedBannerProps {
    title: string
    subtitle: string
    ctaText: string
    bgColor?: string
}

export default function FeaturedBanner({
    title,
    subtitle,
    ctaText,
    bgColor = "from-blue-600 to-blue-800",
}: FeaturedBannerProps) {
    return (
        <div
            className={`w-full rounded-xl overflow-hidden bg-gradient-to-r ${bgColor} p-6 md:p-8 flex flex-col md:flex-row items-center justify-between`}
        >
            <div className="text-white mb-4 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold mb-2">{title}</h2>
                <p className="text-xl md:text-2xl">{subtitle}</p>
            </div>
            <Button className="bg-white text-blue-700 hover:bg-blue-100 font-medium px-6 py-2 text-lg">{ctaText}</Button>
        </div>
    )
}
