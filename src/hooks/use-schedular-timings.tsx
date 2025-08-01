import { useState, useEffect } from 'react';

type MarketSchedule = {
    type: string;
    openHour: number;
    openMinute: number;
    closeHour: number;
    closeMinute: number;
    days?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday. If omitted, open all days.
};

type MarketStatus = {
    type: string;
    isOpen: boolean;
    timeToOpen: number | null; // seconds until open, or null if open
    timeToClose: number | null; // seconds until close, or null if closed
};

/**
 * Schedules for all markets, times in UTC.
 * You can add/remove/modify as needed.
 */
const MARKET_SCHEDULES: MarketSchedule[] = [
    {
        type: 'comex',
        openHour: 10,
        openMinute: 0,
        closeHour: 14,
        closeMinute: 0,
        days: [1, 2, 3, 4, 5], // Monday-Friday
    },
    {
        type: 'crypto',
        openHour: 0,
        openMinute: 0,
        closeHour: 23,
        closeMinute: 59,
        // open all days
    },
    {
        type: 'usa_market',
        openHour: 14,
        openMinute: 0,
        closeHour: 20,
        closeMinute: 0,
        days: [1, 2, 3, 4, 5], // Monday-Friday
    },
    {
        type: 'nse',
        openHour: 4,
        openMinute: 0,
        closeHour: 10,
        closeMinute: 0,
        days: [1, 2, 3, 4, 5], // Monday-Friday
    },
    {
        type: 'mcx',
        openHour: 14,
        openMinute: 0,
        closeHour: 18,
        closeMinute: 0,
        days: [1, 2, 3, 4, 5], // Monday-Friday
    },
];

/**
 * Custom hook to get market status (open/closed, time to open/close) for all markets.
 * @returns Array of { type, isOpen, timeToOpen, timeToClose }
 */
const useMarketSchedule = (): MarketStatus[] => {
    const [statuses, setStatuses] = useState<MarketStatus[]>([]);

    useEffect(() => {
        const checkAllMarketStatuses = () => {
            const now = new Date();
            const utcDay = now.getUTCDay();
            const utcHour = now.getUTCHours();
            const utcMinute = now.getUTCMinutes();
            const utcSecond = now.getUTCSeconds();

            const results: MarketStatus[] = MARKET_SCHEDULES.map(schedule => {
                // Check if today is a valid market day
                const isMarketDay = !schedule.days || schedule.days.includes(utcDay);

                // Calculate open and close times in minutes since midnight
                const openMinutes = schedule.openHour * 60 + schedule.openMinute;
                const closeMinutes = schedule.closeHour * 60 + schedule.closeMinute;
                const nowMinutes = utcHour * 60 + utcMinute;

                let isOpen = false;
                let timeToOpen: number | null = null;
                let timeToClose: number | null = null;

                if (isMarketDay) {
                    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
                        isOpen = true;
                        // Time to close in seconds
                        timeToClose = (closeMinutes - nowMinutes) * 60 - utcSecond;
                        timeToOpen = null;
                    } else {
                        isOpen = false;
                        // Time to open in seconds
                        let daysToNextOpen = 0;
                        if (nowMinutes < openMinutes) {
                            // Later today
                            daysToNextOpen = 0;
                        } else {
                            // Find next valid day
                            let nextDay = (utcDay + 1) % 7;
                            daysToNextOpen = 1;
                            while (schedule.days && !schedule.days.includes(nextDay)) {
                                nextDay = (nextDay + 1) % 7;
                                daysToNextOpen++;
                            }
                        }
                        // Calculate seconds to next open
                        const nextOpenDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), schedule.openHour, schedule.openMinute, 0));
                        if (daysToNextOpen > 0) {
                            nextOpenDate.setUTCDate(nextOpenDate.getUTCDate() + daysToNextOpen);
                        }
                        timeToOpen = Math.floor((nextOpenDate.getTime() - now.getTime()) / 1000);
                        if (timeToOpen < 0) timeToOpen = 0;
                        timeToClose = null;
                    }
                } else {
                    // Not a market day, find next valid day
                    let daysToNextOpen = 1;
                    let nextDay = (utcDay + 1) % 7;
                    while (schedule.days && !schedule.days.includes(nextDay)) {
                        nextDay = (nextDay + 1) % 7;
                        daysToNextOpen++;
                    }
                    const nextOpenDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), schedule.openHour, schedule.openMinute, 0));
                    nextOpenDate.setUTCDate(nextOpenDate.getUTCDate() + daysToNextOpen);
                    timeToOpen = Math.floor((nextOpenDate.getTime() - now.getTime()) / 1000);
                    if (timeToOpen < 0) timeToOpen = 0;
                    isOpen = false;
                    timeToClose = null;
                }

                return {
                    type: schedule.type,
                    isOpen,
                    timeToOpen,
                    timeToClose,
                };
            });

            setStatuses(results);
        };

        checkAllMarketStatuses();
        const intervalId = setInterval(checkAllMarketStatuses, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return statuses;
};

export default useMarketSchedule;