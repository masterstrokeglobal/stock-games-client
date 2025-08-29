import Navbar from "@/components/features/game/navbar";
import JackpotBettingHistory from "@/components/features/stock-jackpot/betting-history";
import GameRule from "@/components/features/stock-jackpot/game-rule";
import HowToPlay from "@/components/features/stock-jackpot/how-to-play";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SkewedButton } from "@/components/ui/skew-button";
import Link from "next/link";

const SettingPage = () => {
    return (
        <section className="relative w-full lg:h-screen min-h-[100svh] lg:overflow-hidden flex flex-col ">
            <Navbar />
            <img src="/images/jackpot/bg.png" className="w-full h-full absolute z-0" />
            <div className="bg-black bg-opacity-10 absolute backdrop-blur-md h-full w-full z-0" />
            <main className="z-10 flex flex-col items-center flex-1 justify-center pt-20 px-4">
                <div className="w-full max-w-4xl h-full flex-1 flex flex-col">
                    <div className="flex-1 overflow">
                        <Accordion type="single" collapsible className="space-y-4 h-full flex flex-col">
                            {/* My Bet History */}
                            <AccordionItem value="bet-history" className="border border-white rounded-[20px] bg-[#B9FAFF80] md:px-6 px-3 flex-shrink-0 data-[state=open]:backdrop-blur-[22.4px] data-[state=open]:shadow-[0px_0px_6px_5px_#04D9FF] data-[state=open]:bg-[#74F5FF80]">
                                <AccordionTrigger iconClassName="text-white size-7" className="text-[#C7F4FF] md:py-4 py-2 font-audiowale sm:text-lg font-medium hover:no-underline">
                                    My Bet History
                                </AccordionTrigger>
                                <AccordionContent>
                                    <JackpotBettingHistory />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="how-to-play" className="border border-white rounded-[20px] bg-[#B9FAFF80] md:px-6 px-3 flex-shrink-0 data-[state=open]:backdrop-blur-[22.4px] data-[state=open]:shadow-[0px_0px_6px_5px_#04D9FF] data-[state=open]:bg-[#74F5FF80]">
                                <AccordionTrigger iconClassName="text-white size-7" className="text-[#C7F4FF]  md:py-4 py-2  font-audiowale sm:text-lg font-medium hover:no-underline">
                                    How to play?
                                </AccordionTrigger>
                                <AccordionContent >
                                    <HowToPlay />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="game-rules" className="border border-white rounded-[20px] bg-[#B9FAFF80] md:px-6 px-3 flex-shrink-0 data-[state=open]:backdrop-blur-[22.4px] data-[state=open]:shadow-[0px_0px_6px_5px_#04D9FF] data-[state=open]:bg-[#74F5FF80]">
                                <AccordionTrigger iconClassName="text-white size-7" className="text-[#C7F4FF]  md:py-4 py-2  font-audiowale sm:text-lg font-medium hover:no-underline">
                                    Game Rules
                                </AccordionTrigger>
                                <AccordionContent>
                                    <GameRule />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between py-3 flex-shrink-0">
                        <Link href="/game/single-player/jackpot">
                            <SkewedButton size="md" skew="right" variant="red">
                                Back
                            </SkewedButton>
                        </Link>
                        {/* Play Button */}
                        <Link href="/game/single-player/jackpot">
                            <SkewedButton size="md" variant="green" skew="left">
                                Play
                            </SkewedButton>
                        </Link>
                    </div>
                </div>
            </main>
        </section>
    );
}

export default SettingPage;