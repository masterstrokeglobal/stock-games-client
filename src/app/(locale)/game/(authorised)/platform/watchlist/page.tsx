"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetWatchlist, useToggleToFavorites } from "@/react-query/favorite-market-item-queries";
import {
  IconBookmark,
  IconHeart,
  IconSearch
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const WatchlistPage = () => {
  const { data: watchlist, isLoading } = useGetWatchlist();
  const toggleFavorite = useToggleToFavorites();
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleToggleBookmark = (itemId: number) => {
    toggleFavorite.mutate(itemId);
  };

  const filteredWatchlist = watchlist?.filter(item =>
    selectedType === "all" || item.type === selectedType
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-300 text-lg">Loading watchlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="bg-slate-800/50 rounded-2xl p-8 mb-6 border border-slate-700">
              <IconHeart className="h-20 w-20 text-gray-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Your Watchlist is Empty
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Start adding your favorite market items to track them here. this items will appear at top in Games such as Stock slot and stock jackpot.
            </p>
            <Link href="/game/platform/stock-games">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl transition-all duration-300">
                Play Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Watchlist
          </h1>
          <p className="text-gray-200 text-lg">
            {filteredWatchlist.length} {filteredWatchlist.length === 1 ? 'item' : 'items'} in your watchlist
          </p>
          <p className="text-gray-200 mb-8 text-lg">
              Start adding your favorite market items to track them here. this items will appear at top in Games such as Stock slot and stock jackpot.
            </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search stocks, crypto, markets..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Market Type Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1 border border-slate-700">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${selectedType === "all"
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
            >
              All Markets
            </button>
            <button
              onClick={() => setSelectedType("nse")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${selectedType === "nse"
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
            >
              NSE
            </button>
            <button
              onClick={() => setSelectedType("crypto")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${selectedType === "crypto"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
            >
              Crypto
            </button>
            <button
              onClick={() => setSelectedType("usa_market")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${selectedType === "usa_market"
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
            >
              US Stock
            </button>
          </div>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWatchlist.map((item, index) => (
            <Card
              key={item.id}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 rounded-2xl overflow-hidden backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards"
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Name */}
                    <CardTitle className="text-xl font-bold text-white leading-tight">
                      {item.name}
                    </CardTitle>

                    {/* Code */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Code:</span>
                      <span className="text-lg font-mono text-white bg-slate-700/50 px-3 py-1 rounded-lg">
                        {item.code}
                      </span>
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Type:</span>
                      <Badge
                        className={`text-xs font-semibold rounded-lg px-3 py-1 ${item.type === "nse"
                            ? "bg-green-600/20 text-green-300 border-green-600/30"
                            : item.type === "crypto"
                              ? "bg-orange-600/20 text-orange-300 border-orange-600/30"
                              : "bg-blue-600/20 text-blue-300 border-blue-600/30"
                          }`}
                      >
                        {item.type?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleBookmark(item.id ?? 0)}
                    disabled={toggleFavorite.isPending}
                    className="ml-3 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300 rounded-xl"
                    title="Remove from watchlist"
                  >
                    <IconBookmark className="h-5 w-5 fill-current text-orange-400" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Empty Filter State */}
        {filteredWatchlist.length === 0 && selectedType !== "all" && (
          <div className="text-center py-12">
            <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/30">
              <p className="text-gray-400 text-lg">
                No items found for <span className="text-orange-300 font-semibold">{selectedType?.toUpperCase()}</span> type
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;