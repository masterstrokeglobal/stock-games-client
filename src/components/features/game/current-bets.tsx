"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CurrentBets = () => {
    const currentBetsData = [
        { crypto: "ETH", userId: 24586, amount: "$2,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$1,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$3,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$6,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$3,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$6,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$3,000.00" },
        { crypto: "ETH", userId: 24586, amount: "$6,000.00" },
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
            className="p-4 rounded-2xl h-full w-full  bg-[#122146]"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Current Bets
            </h2>
            <ScrollArea className="max-h-96 w-full" style={{ height: `${scrollAreaHeight - 20}px` }}>
                <table className="min-w-full">
                    <thead>
                        <tr className="flex">
                            <th className="p-2 text-sm text-left text-gray-300 rounded-tl-lg flex-1">
                                Crypto
                            </th>
                            <th className="p-2 text-sm text-left text-gray-300 rounded-tl-lg flex-1">
                                User ID
                            </th>
                            <th className="p-2 text-sm text-right text-gray-300 rounded-tr-lg flex-1">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBetsData.map((bet, index) => (
                            <tr
                                key={index}
                                className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                style={{ display: 'flex', flexDirection: 'row' }}
                            >
                                <td className="p-2 text-sm text-gray-300 rounded-l-lg flex-1">
                                    {bet.crypto}
                                </td>
                                <td className="p-2 text-sm text-gray-300 flex-1">
                                    {bet.userId}
                                </td>
                                <td className="p-2 text-sm text-right text-gray-300 rounded-r-lg flex-1">
                                    {bet.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </section>
    );
};

export default CurrentBets;
