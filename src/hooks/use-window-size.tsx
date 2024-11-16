"use client";
import { useEffect, useState } from "react";

// Type definitions for window size and device type
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface WindowSize {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    device: DeviceType;
}

// Tailwind default breakpoints
const BREAKPOINTS = {
    sm: 640,   // Mobile
    md: 768,   // Tablet
    lg: 1024,  // Desktop
} as const;

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        device: 'mobile'
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Determine device type based on width
            const isMobile = width < BREAKPOINTS.lg;
            const isTablet = width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
            const isDesktop = width >= BREAKPOINTS.lg;

            let device: DeviceType = 'mobile';
            if (isDesktop) device = 'desktop';
            else if (isTablet) device = 'tablet';

            setWindowSize({
                width,
                height,
                isMobile,
                isTablet,
                isDesktop,
                device
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures effect is only run on mount and unmount

    return windowSize;
};

export default useWindowSize;