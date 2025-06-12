import { useState, useEffect } from 'react';

/**
 * Custom hook to check if the US stock market is currently open
 * @returns {boolean} isUSAMarketOpen - Whether the US stock market is currently open
 */
const useUSAMarketAvailable = () => {
  const [isUSAMarketOpen, setIsUSAMarketOpen] = useState(false);
  
  useEffect(() => {
    const checkUSAMarketAvailability = () => {
      // Get current date in user's local timezone
      const now = new Date();
      
      // Convert to US Eastern Time (ET) which is UTC-4 (EDT) or UTC-5 (EST)
      // Using a consistent offset for EDT (UTC-4)
      const etOffsetHours = -4;
      
      // Calculate the ET time by adjusting from UTC
      const etHours = (now.getUTCHours() + etOffsetHours + 24) % 24;
      const etMinutes = now.getUTCMinutes();
      const etDay = now.getUTCDay();
      
      // Market hours: 9:30 AM - 4:00 PM ET, Monday-Friday
      const marketOpenHour = 10;
      const marketOpenMinute = 0;
      const marketCloseHour = 16;
      const marketCloseMinute = 0;
      
      // Convert times to minutes for comparison
      const currentTimeInMinutes = etHours * 60 + etMinutes;
      const marketOpenTimeInMinutes = marketOpenHour * 60 + marketOpenMinute;
      const marketCloseTimeInMinutes = marketCloseHour * 60 + marketCloseMinute;
      
      // Check if it's a weekday (1-5 corresponds to Monday-Friday)
      const isWeekday = etDay >= 1 && etDay <= 5;
      
      // Check if current time is between market open and close
      const isMarketHours = 
        currentTimeInMinutes >= marketOpenTimeInMinutes && 
        currentTimeInMinutes < marketCloseTimeInMinutes;
      
      // Market is open if it's both a weekday and during market hours
      const newMarketStatus = isWeekday && isMarketHours;
      
      if (isUSAMarketOpen !== newMarketStatus) {
        setIsUSAMarketOpen(newMarketStatus);
      }
    };
    
    // Initial check
    checkUSAMarketAvailability();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkUSAMarketAvailability, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [isUSAMarketOpen]);
  
  return isUSAMarketOpen;
};

export default useUSAMarketAvailable;