"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const LeaderBoard = () => {
    const leaderboardData = [
        { rank: 1, name: "Bitcoin", price: "$27,000.00" },
        { rank: 2, name: "Ethereum", price: "$1,800.00" },
        { rank: 3, name: "Binance Coin", price: "$240.00" },
        { rank: 4, name: "Litecoin", price: "$68.00" },
        { rank: 5, name: "Avalanche", price: "$10.00" },
        { rank: 6, name: "Polkadot", price: "$4.10" },
        { rank: 7, name: "Chainlink", price: "$6.70" },
        { rank: 8, name: "Solana", price: "$20.00" },
    ];

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40); // Subtract 40px from section height
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            className="p-4  rounded-2xl  h-full w-full  bg-[#122146]"
        >
            <h2 className="text-xl font-semibold mb-4  text-gray-200">
                Leader Board
            </h2>
            <ScrollArea className="max-h-96 w-full" style={{ height: `${scrollAreaHeight - 20}px` }}>
                <table className="min-w-full">

                    <tbody>
                        {leaderboardData.map((crypto) => (
                            <tr key={crypto.rank} className="border-b last:border-none  rounded-lg border-[#DADCE00D]  overflow-hidden  ">
                                <td className="p-2 w-12 justify-center  text-gray-300 flex items-center">
                                    {/* Conditionally render rank image for 1, 2, and 3 */}
                                    {crypto.rank === 1 ? (
                                        <img
                                            src="/rank-1.svg"
                                            alt="Rank 1"
                                            className=" mr-2"
                                        />
                                    ) : crypto.rank === 2 ? (
                                        <img
                                            src="/rank-2.svg"
                                            alt="Rank 2"
                                            className=" mr-2"
                                        />
                                    ) : crypto.rank === 3 ? (
                                        <img
                                            src="/rank-3.svg"
                                            alt="Rank 3"
                                            className=" mr-2"
                                        />
                                    ) : (
                                        <span className="mr-2 text-[#8990A2]">{crypto.rank}</span> // For default ranks, just display the rank number
                                    )}
                                </td>
                                <td className="p-2 text-sm text-gray-300 rounded-lg">{crypto.name}</td>
                                <td className="p-2 text-sm text-right text-gray-300 rounded-lg">{crypto.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </section>
    );
};

export default LeaderBoard;
