"use client"

import { useState } from "react"
import { ArrowRightIcon, TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BettingCard } from "./BettingCard"

interface MarketListProps {
  nseAssets: Asset[]
  cryptoAssets: Asset[]
  usStockAssets: Asset[]
  betSlip: BetSlipItem[]
  globalBetAmount: number
  onAddBet: (asset: Asset, betType: BetType, predictedDigits: string) => void
}

export function MarketList({
  nseAssets,
  cryptoAssets,
  usStockAssets,
  betSlip,
  globalBetAmount,
  onAddBet,
}: MarketListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter assets based on search query
  const filterAssets = (assets: Asset[]) => {
    if (!searchQuery) return assets
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const filteredNseAssets = filterAssets(nseAssets)
  const filteredCryptoAssets = filterAssets(cryptoAssets)
  const filteredUsStockAssets = filterAssets(usStockAssets)

  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search markets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#1A1E2E] border-[#2A2F42] text-white"
        />
      </div>

      <Tabs defaultValue="nse" className="w-full">
        <TabsList className="w-full bg-[#1A1E2E] border border-[#2A2F42] p-1 mb-6">
          <TabsTrigger value="nse" className="flex-1 data-[state=active]:bg-[#2A2F42]">
            NSE
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex-1 data-[state=active]:bg-[#2A2F42]">
            Crypto
          </TabsTrigger>
          <TabsTrigger value="us-stocks" className="flex-1 data-[state=active]:bg-[#2A2F42]">
            US Stocks
          </TabsTrigger>
        </TabsList>

        {/* NSE Tab Content */}
        <TabsContent value="nse" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <TrendingUpIcon className="w-5 h-5 mr-2 text-blue-400" />
              NSE Markets
            </h2>
            <Link href="#" className="text-sm text-blue-400 flex items-center">
              View All <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {filteredNseAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No markets found matching your search.</div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-6 px-2 py-4">
                {filteredNseAssets.map((asset) => (
                  <BettingCard
                    key={asset.id}
                    asset={asset}
                    betSlip={betSlip}
                    globalBetAmount={globalBetAmount}
                    onAddBet={onAddBet}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </TabsContent>

        {/* Crypto Tab Content */}
        <TabsContent value="crypto" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <Image src="/placeholder.svg?height=20&width=20" width={20} height={20} alt="Crypto" className="mr-2" />
              Crypto Markets
            </h2>
            <Link href="#" className="text-sm text-yellow-400 flex items-center">
              View All <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {filteredCryptoAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No markets found matching your search.</div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-6 px-2 py-4">
                {filteredCryptoAssets.map((asset) => (
                  <BettingCard
                    key={asset.id}
                    asset={asset}
                    betSlip={betSlip}
                    globalBetAmount={globalBetAmount}
                    onAddBet={onAddBet}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </TabsContent>

        {/* US Stocks Tab Content */}
        <TabsContent value="us-stocks" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <Image
                src="/placeholder.svg?height=20&width=20"
                width={20}
                height={20}
                alt="US Stocks"
                className="mr-2"
              />
              US Stock Markets
            </h2>
            <Link href="#" className="text-sm text-green-400 flex items-center">
              View All <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {filteredUsStockAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No markets found matching your search.</div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-6 px-2 py-4">
                {filteredUsStockAssets.map((asset) => (
                  <BettingCard
                    key={asset.id}
                    asset={asset}
                    betSlip={betSlip}
                    globalBetAmount={globalBetAmount}
                    onAddBet={onAddBet}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
