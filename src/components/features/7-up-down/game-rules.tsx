import { ScrollArea } from "@/components/ui/scroll-area";

const GameRules = () => {
    return (
        <section className="flex flex-col h-full pb-10 gap-4">
            <header>
                <h1 className="md:text-xl uppercase tracking-widest xs:text-lg  font-bold text-[#8BB4FF]">Game Rules</h1>
            </header>
            <main className="rounded-[30px]  border-[3px] max-w-2xl mx-auto w-full  border-[#12409D] bg-[rgba(1,15,60,0.58)] shadow-[0px_0px_7.1px_11px_rgba(1,59,177,0.25)_inset] p-6">
                <ScrollArea scrollThumbClassName="bg-[#BED5FF]" className="space-y-6 h-[calc(100svh-23rem)] text-white">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-[#6DC1EE]">How It Works</h2>
                        <ul className="space-y-3 text-sm leading-relaxed">
                            <li className="flex items-start gap-3">
                                <span className="text-[#6DC1EE] font-bold">1.</span>
                                <span>14 random stocks are selected from the market for each round</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#6DC1EE] font-bold">2.</span>
                                <span>Place your bets on 7UP, 7DOWN, or 7</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#6DC1EE] font-bold">3.</span>
                                <span>When the round ends, count how many stocks are positive</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-[#6DC1EE]">Winning Conditions</h2>
                        <div className="grid gap-4 text-sm">
                            <div className="p-4 rounded-lg bg-[rgba(41,92,181,0.3)] border border-[#295CB5]">
                                <div className="font-semibold text-[#8BB4FF] mb-2">7UP Wins If:</div>
                                <div>More than 7 stocks end positive</div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(41,92,181,0.3)] border border-[#295CB5]">
                                <div className="font-semibold text-[#8BB4FF] mb-2">7DOWN Wins If:</div>
                                <div>Less than 7 stocks end positive</div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(41,92,181,0.3)] border border-[#295CB5]">
                                <div className="font-semibold text-[#8BB4FF] mb-2">7 Wins If:</div>
                                <div>Exactly 7 stocks end positive</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-[#6DC1EE]">Important Notes</h2>
                        <ul className="space-y-2 text-sm text-[#B8C7E8]">
                            <li>• Each round lasts for a specific time period</li>
                            <li>• You can place multiple bets during a round</li>
                            <li>• Stock prices are updated in real-time</li>
                            <li>• Winners are determined by the final stock positions</li>
                        </ul>
                    </div>
                </ScrollArea>
            </main>
        </section>
    );
};

export default GameRules;