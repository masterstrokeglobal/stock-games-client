"use client";

import Navbar from '@/components/features/game/navbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LOBBY_GAMES } from '@/lib/constants';
import { ChevronRight, Info, Timer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const GameDescriptionPage = () => {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1F]  px-4  md:p-8">
        <div className="max-w-7xl mx-auto mt-20">
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Select Your Game
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge
                variant="outline"
                className="flex text-white items-center gap-2 px-6 py-3 text-sm bg-white/5 hover:bg-white/10 
              transition-all duration-300 border-white/10 animate-slideInLeft"
              >
                <Timer className="h-5 w-5 text-blue-400" />
                2 Minutes Per Game
              </Badge>
              <Badge
                variant="outline"
                className="flex text-white items-center gap-2 px-6 py-3 text-sm bg-white/5 hover:bg-white/10 
              transition-all duration-300 border-white/10 animate-slideInRight"
              >
                <Info className="h-5 w-5 text-purple-400" />
                16 Stocks Available
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOBBY_GAMES.map((game, index) => (
              <Link
                key={index}
                href={`/game/lobby?gameType=${game.gameType}`}
                className="block transform transition-all duration-300 hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredGame(index)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <Card
                  className="bg-[#1A1F2E] border-white/5 text-white 
                hover:bg-[#1E2436] transition-all duration-300 
                relative group h-full
                shadow-lg hover:shadow-xl hover:border-white/10"
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 
                    group-hover:scale-110 transition-transform duration-300
                    bg-gradient-to-r ${game.color}`}
                    >
                      <div className="text-white transition-transform duration-300 group-hover:rotate-12">
                        <Image src={game.image} alt={game.title} width={64} height={64} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3">
                      {game.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-base">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-4">
                      {game.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-4 group">
                          <span className="text-xs bg-white/10 rounded-lg px-2.5 py-1 mt-1 
                          transition-colors duration-200 group-hover:bg-white/15">
                            {idx + 1}
                          </span>
                          <span className="text-gray-300 transition-colors duration-200 group-hover:text-gray-200">
                            {rule}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {hoveredGame === index && (
                      <div className="absolute bottom-4 right-4 animate-slideInRight">
                        <ChevronRight className="h-6 w-6 text-white/60" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideInRight {
              from { transform: translateX(20px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
              }
              
              @keyframes fadeInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-fadeIn {
                  animation: fadeIn 0.5s ease-out forwards;
                  }
                  
                  .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                    }
                    
                    .animate-slideInRight {
                      animation: slideInRight 0.5s ease-out forwards;
                      }
                      
                      .animate-fadeInUp {
                        opacity: 0;
                        animation: fadeInUp 0.5s ease-out forwards;
                        }
                        `}</style>
      </div>
    </>
  );
};

export default GameDescriptionPage;