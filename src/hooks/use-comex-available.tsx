import { useState, useEffect } from 'react';

// Helper to get current IST time as a Date object
const getISTDate = () => {
    const now = new Date();
    // IST is UTC+5:30
    const istOffset = 5.5 * 60; // in minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + istOffset * 60000);
};

const isCOMEXOpenAt = (date: Date) => {
    // COMEX open time: 15:30, close time: 19:30 IST (3:30 pm to 7:30 pm)
    const openMinutes = 15 * 60 + 30;
    const closeMinutes = 19 * 60 + 30;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const day = date.getDay(); 
    const isWeekday = day >= 1 && day <= 5; // Monday to Friday only
    return isWeekday && currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

const useCOMEXAvailable = () => {
    const [isCOMEXOpen, setIsCOMEXOpen] = useState(() => isCOMEXOpenAt(getISTDate()));

    useEffect(() => {
        const updateStatus = () => {
            setIsCOMEXOpen(isCOMEXOpenAt(getISTDate()));
        };

        updateStatus();

        const now = getISTDate();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // Use refs to store timeout and interval IDs for cleanup
        let intervalId: ReturnType<typeof setInterval>;
        const timeoutId = setTimeout(() => {
            updateStatus();
            intervalId = setInterval(updateStatus, 60000);
        }, msToNextMinute);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return isCOMEXOpen;
};

export default useCOMEXAvailable;