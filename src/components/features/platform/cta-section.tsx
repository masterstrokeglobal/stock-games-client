import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section
      className="w-full rounded-none border border-[#4467CC] overflow-hidden my-6 flex items-center justify-start min-h-[180px] md:min-h-[240px] bg-[url('/images/banner/cta-bg.png')] bg-cover bg-center"
    >
      <div className="p-4 sm:p-8 flex flex-col gap-3 sm:gap-4 max-w-xs">
        <div className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight drop-shadow-md">
          <div>Every Game Counts</div>
          <div>Watch Your</div>
          <div>Wallet Grow!</div>
        </div>
        <Link href="/game/platform/casino" passHref>
          <Button
            variant="platform-primary"
            size="sm"
            className="rounded-md font-bold shadow-lg"
          >
            Play Now
          </Button>
        </Link>
      </div>
    </section>
  )
}
