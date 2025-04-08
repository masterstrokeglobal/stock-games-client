import { ChevronLeft, ChevronRight, Users, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import FeaturedBanner from "@/components/features/platform/featured-banner"
import GameCard from "@/components/features/platform/game-card"
import Navbar from "@/components/features/game/navbar"
import { LOBBY_GAMES } from "@/lib/constants"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
   <Navbar/>

      <main className="container mx-auto px-4 py-6 space-y-8 mt-20">
        {/* Featured Banners */}
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <FeaturedBanner
                title="Get 500 Bonus Points"
                subtitle="Joining Bonus"
                ctaText="Deposit Now"
                bgColor="from-pink-600 to-pink-800"
              />
            </CarouselItem>
            <CarouselItem>
              <FeaturedBanner
                title="Refer & Earn Big!"
                subtitle="Invite Friends"
                ctaText="Start Referring Now"
                bgColor="from-pink-700 to-pink-900"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-blue-800/50 hover:bg-blue-800 text-white" />
          <CarouselNext className="right-2 bg-blue-800/50 hover:bg-blue-800 text-white" />
        </Carousel>

        {/* Play with Friends Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-xl font-bold text-game-text">Play with Friends</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {LOBBY_GAMES.map((game) => (
          <GameCard
          key={game.title}
          title={game.title}
          category={game.gameType}
          players={"0"}
          image={"/placeholder.svg?height=200&width=300"}
          />
         ))   }
          </div>
        </section>

        {/* Stock Derby Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-xl font-bold text-game-text">Stock Derby</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GameCard
              title="Tech Stocks Race"
              image="/placeholder.svg?height=200&width=300"
              players="Virtual Trading"
              category="Simulation"
            />
            <GameCard
              title="Crypto Challenge"
              image="/placeholder.svg?height=200&width=300"
              players="Price Prediction"
              category="Crypto"
            />
            <GameCard
              title="Market Masters"
              image="/placeholder.svg?height=200&width=300"
              players="Portfolio Building"
              category="Strategy"
            />
            <GameCard
              title="Day Trader"
              image="/placeholder.svg?height=200&width=300"
              players="Quick Trades"
              category="Fast-paced"
            />
          </div>
        </section>

        {/* Mini Mutual Fund Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <h2 className="text-xl font-bold text-game-text">Mini Mutual Fund</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500 text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GameCard
              title="Growth Fund"
              image="/placeholder.svg?height=200&width=300"
              players="Long-term"
              category="Aggressive"
            />
            <GameCard
              title="Balanced Portfolio"
              image="/placeholder.svg?height=200&width=300"
              players="Medium Risk"
              category="Balanced"
            />
            <GameCard
              title="Income Generator"
              image="/placeholder.svg?height=200&width=300"
              players="Dividend Focus"
              category="Conservative"
            />
            <GameCard
              title="Index Tracker"
              image="/placeholder.svg?height=200&width=300"
              players="Market Following"
              category="Passive"
            />
          </div>
        </section>
      </main>

      <footer className="bg-blue-950 border-t border-blue-800 py-4">
        <div className="container mx-auto px-4 text-center text-blue-300 text-sm">
          <p>RULES & REGULATIONS © 2025</p>
        </div>
      </footer>
    </div>
  )
}
