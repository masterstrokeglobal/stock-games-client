import { useState, useEffect } from 'react';

const useNSEAvailable = () => {
    const [isNSEOpen, setIsNSEOpen] = useState(false);

    useEffect(() => {
        const checkNSEAvailability = () => {
            const now = new Date();

            const hours = now.getHours();
            const minutes = now.getMinutes();

            const currentTimeInMinutes = hours * 60 + minutes;

            const marketOpenTime = 9 * 60 + 15;
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

    return isNSEOpen;
};

export default useNSEAvailable;    