"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { StockDerbyGames } from "@/lib/constants";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function GamingAppInterface() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredGames = StockDerbyGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen  text-white mx-auto">
            <main className="container mx-auto  md:px-4 py-6">
                {/* Search Bar */}
                <header className="container mx-auto py-4">
                    <h1 className="text-2xl font-bold capitalize text-platform-text">Stock Games</h1>
                </header>
                <div className="relative w-full  mb-6">
                    <Input
                        className="w-full bg-primary-game border-platform-border ring-0 focus:bg-primary-game/80 border focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 pl-10 rounded-none"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-200" size={20} />
                </div>


                {/* Content: Custom Game Grid */}
                <div className="mt-8">
                    {filteredGames.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-platform-text text-lg">No games found</p>
                        </div>
                    ) : (
                        <div className="grid xs:grid-cols-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 gap-2">
                            {filteredGames.map((game) => (
                                <Link key={game.link} href={game.link} className="w-full">
                                    <Card className="overflow-hidden rounded-none relative shadow-lg border border-platform-border " style={{ aspectRatio: '170/240' }}>
                                        <Image 
                                            src={game.image} 
                                            alt={game.title} 
                                            className="w-full h-full object-top" 
                                            width={500} 
                                            height={500} 
                                        />
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
