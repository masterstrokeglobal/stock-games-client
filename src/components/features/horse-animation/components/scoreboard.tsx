"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {  DollarSign, Trophy, Clock, Heart } from "lucide-react";
import initialHorses from "./data";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Horse {
  id: number;
  number: number;
  name: string;
  jockey: string;
  time: string;
  rank: number;
  odds: string;
}


const RankCell = ({ rank }: { rank: number }) => (
  <TableCell className="w-16 p-0">
    <AnimatePresence mode="popLayout">
      <motion.div
        key={rank}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ backfaceVisibility: "hidden" }}
        className="py-2 px-3 rounded-md shadow-md bg-amber-300 text-gray-900 font-bold text-2xl text-center"
      >
        {rank}
      </motion.div>
    </AnimatePresence>
  </TableCell>
);

const HorseNumberCell = ({ number }: { number: number }) => (
  <TableCell className="w-16 text-center">
    <span className="inline-block w-10 h-10 rounded-full bg-red-600 text-amber-500 font-bold text-xl leading-10">
      {number}
    </span>
  </TableCell>
);

export default function Scoreboard() {
  const [horses, setHorses] = useState(initialHorses);
  const [totalBet, setTotalBet] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setHorses((prevHorses) => {
        const newHorses = [...prevHorses];
        const index1 = Math.floor(Math.random() * newHorses.length);
        let index2 = Math.floor(Math.random() * newHorses.length);
        while (index2 === index1) {
          index2 = Math.floor(Math.random() * newHorses.length);
        }
        const tempRank = newHorses[index1].rank;
        newHorses[index1].rank = newHorses[index2].rank;
        newHorses[index2].rank = tempRank;

        // Update times and odds based on new ranks
        newHorses.forEach((horse) => {
          const baseTime = 123.45; // 2:03.45 in seconds
          horse.time = formatTime(baseTime + (horse.rank - 1) * 0.22);
          horse.odds = `${horse.rank + 2}:1`;
        });

        return newHorses.sort((a, b) => a.rank - b.rank);
      });

      // Simulate betting activity
      setTotalBet((prevBet) => prevBet + Math.floor(Math.random() * 100 - 50));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes}:${remainingSeconds.padStart(5, "0")}`;
  };

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild className="absolute top-4 right-4 z-50">
        <Button className="bg-amber-700 text-amber-100 hover:bg-amber-800 font-bold">
           Open Scoreboard
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[650px] p-0">
        <Card className="w-full rounded-lg max-w-4xl mx-0 z-50 bg-gray-900 shadow-xl border-2 border-amber-600">
          <CardHeader className="bg-gray-800 text-amber-300 p-4">
            <CardTitle className="text-4xl font-bold text-center tracking-wide flex items-center justify-center font-serif">
              <Trophy className="mr-2 h-8 w-8" /> Horse Race Scoreboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 text-amber-300">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <span className="text-lg font-bold font-sans">Next Race: 5:00</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                <span className="text-lg font-bold font-sans">Total Bet: ${totalBet}</span>
              </div>
            </div>
                <ScrollArea className="h-[500px]"> 
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800  text-amber-300">
                  <TableHead className="w-16 text-center  text-lg font-sans">Rank</TableHead>
                  <TableHead className="w-16 text-center text-lg font-sans">Number</TableHead>
                  <TableHead className="text-lg font-sans">Horse</TableHead>
                  <TableHead className="text-lg font-sans">Jockey</TableHead>
                  <TableHead className="text-right text-lg font-sans">Time</TableHead>
                  <TableHead className="text-right text-lg font-sans">Odds</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horses.map((horse) => (
                  <TableRow
                    key={horse.id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <RankCell rank={horse.rank} />
                    <HorseNumberCell number={horse.number} />
                    <TableCell className="font-medium text-amber-100 text-xl font-sans">{horse.name}</TableCell>
                    <TableCell className="text-amber-200 font-sans">{horse.jockey}</TableCell>
                    <TableCell className="text-right text-amber-300 font-mono">{horse.time}</TableCell>
                    <TableCell className="text-right text-amber-300 font-bold font-sans">{horse.odds}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                </ScrollArea>
            <div className="mt-4 text-center text-amber-300">
              <Heart className="inline-block mr-2 h-5 w-5" />
              <span className="text-sm font-sans">Place your bets responsibly</span>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}