import { useState, useEffect } from 'react';

// Helper to get current IST time as a Date object
const getISTDate = () => {
    const now = new Date();
    // IST is UTC+5:30
    const istOffset = 5.5 * 60; // in minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + istOffset * 60000);
};

const isMCXOpenAt = (date: Date) => {
    const openMinutes = 19 * 60 + 30;
    const closeMinutes = 23 * 60 + 30;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const day = date.getDay(); 
    const isWeekday = day >= 1 && day <= 5; // Monday to Friday only
    return isWeekday && currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

const useMCXAvailable = () => {
    const [isMCXOpen, setIsMCXOpen] = useState(() => isMCXOpenAt(getISTDate()));

    useEffect(() => {
        const updateStatus = () => {
            setIsMCXOpen(isMCXOpenAt(getISTDate()));
        };

        updateStatus();

        const intervalId = setInterval(updateStatus, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return isMCXOpen;
};

export default useMCXAvailable;