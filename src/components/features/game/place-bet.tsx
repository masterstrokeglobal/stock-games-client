"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
};

const PlaceBets = ({ className }: Props) => {
  const t = useTranslations("game");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

  const fancyRounds = [
    { Description: "Next Round Winner" },
    { Description: "Round 1 to 5 Maximum Bet" },
    { Description: "Round 6 to 10 Maximum Bet" },
    { Description: "Round 11 to 15 Maximum Bet" },
    { Description: "Round 16 to 20 Maximum Bet" },
  ];

  const advanceBets = [
    { Description: "Maximum Round Winner is Red" },
    { Description: "Minimum Round Winner is Black" },
    { Description: "In Round 1 to 20 Red will win" },
    { Description: "In Round 10 to 20 Black will win" },
    { Description: "In Round 1 to 40 Red will win" },
    { Description: "In Round 1 to 40 Black will win" },
  ];

  useEffect(() => {
    if (sectionRef.current) {
      const sectionHeight = sectionRef.current.offsetHeight -30;
      setScrollAreaHeight(sectionHeight);
    }
  }, []);


  return (
    <section
      ref={sectionRef}
      className={cn("md:rounded-2xl w-full bg-zinc-900/95 backdrop-blur-sm overflow-hidden" , className)}
    >

      
      <ScrollArea 
        className="h-full"
        style={{ height:  `${scrollAreaHeight}px` }}
        type="auto"
      >
      <div className="w-full bg-gradient-to-r from-red-500/10 via-zinc-900/50 to-zinc-800/10 py-3 px-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-zinc-300 bg-clip-text text-transparent">
          Place Your Bets
        </h2>
      </div>
        <div className="flex gap-2 md:flex-row flex-col p-4">
          <div className="w-full space-y-6">
            <div className="bg-zinc-800/30 rounded-xl overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="flex border-b border-zinc-700/50">
                    <th className="p-4 text-lg font-semibold text-center bg-gradient-to-r from-red-400 to-zinc-300 bg-clip-text text-transparent w-full">
                      {t("current-bets")}
                    </th>
                  </tr>
                  <tr className="flex border-b border-zinc-700/50">
                    <th className="p-4 text-base font-medium text-center flex-1">
                      <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                        {t("red")}
                      </span>
                    </th>
                    <th className="p-4 text-base font-medium text-center flex-1">
                      <span className="bg-gradient-to-r from-zinc-200 to-zinc-300 bg-clip-text text-transparent">
                        {t("black")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex">
                    <td className="p-4 text-sm flex-1">
                      <button className="w-full py-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20">
                        1.77x
                      </button>
                    </td>
                    <td className="p-4 text-sm flex-1">
                      <button className="w-full py-3 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
                        1.99x
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="fancy-bets" className="border-none bg-zinc-800/30 rounded-xl overflow-hidden">
                <AccordionTrigger className="py-4 px-4 hover:no-underline">
                  <span className="text-red-400 font-medium">{t("fancy-bets")}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                    {fancyRounds.map(({ Description }, index) => (
                      <div key={index} className="flex items-center gap-4 px-2">
                        <div className="flex-1 text-sm text-zinc-400">{Description}</div>
                        <div className="flex gap-2">
                          <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all">
                            1.77x
                          </button>
                          <button className="px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all">
                            1.77x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advance-bets" className="border-none bg-zinc-800/30 rounded-xl overflow-hidden">
                <AccordionTrigger className="py-4 px-4 hover:no-underline">
                  <span className="text-zinc-200 font-medium">{t("advance-bets")}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                    {advanceBets.map(({ Description }, index) => (
                      <div key={index} className="flex items-center gap-4 px-2">
                        <div className="flex-1 text-sm text-zinc-400">{Description}</div>
                        <div className="flex gap-2">
                          <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all">
                            1.77x
                          </button>
                          <button className="px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all">
                            1.77x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

export default PlaceBets;
