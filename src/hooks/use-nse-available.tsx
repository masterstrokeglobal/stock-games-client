import { useState, useEffect } from 'react';

const useNSEAvailable = () => {
    const [isNSEOpen, setIsNSEOpen] = useState(false);

    useEffect(() => {
        const checkNSEAvailability = () => {
            const utcTime = new Date();

            const now = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);


            const hours = now.getUTCHours();
            const minutes = now.getUTCMinutes();


            const currentTimeInMinutes = hours * 60 + minutes;

            const marketOpenTime = 9 * 60 + 30;
            const marketCloseTime = 15 * 60 + 30;

            const day = now.getDay();
            const isWeekday = day >= 1 && day <= 5;

            const newMarketStatus = isWeekday && currentTimeInMinutes >= marketOpenTime && currentTimeInMinutes <= marketCloseTime;

            if (isNSEOpen !== newMarketStatus) {
                setIsNSEOpen(newMarketStatus);
            }
        };

        checkNSEAvailability();

        const intervalId = setInterval(checkNSEAvailability, 60000);


        return () => clearInterval(intervalId);
    }, []);

    return true;
};

export default useNSEAvailable;    