import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export const AnimatedEyes = () => {

    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const eyesRef = useRef<HTMLDivElement>(null);

    // Handle eye movement with mouse
    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            if (eyesRef.current) {
                const eyesRect = eyesRef.current.getBoundingClientRect();
                const eyesCenterX = eyesRect.left + eyesRect.width / 2;
                const eyesCenterY = eyesRect.top + eyesRect.height / 2;

                // Calculate normalized position (-1 to 1)
                const maxMovement = 2; // Maximum pixels the pupils can move
                const dx = Math.max(-1, Math.min(1, (e.clientX - eyesCenterX) / (window.innerWidth / 2)));
                const dy = Math.max(-1, Math.min(1, (e.clientY - eyesCenterY) / (window.innerHeight / 2)));

                setEyePosition({
                    x: dx * maxMovement,
                    y: dy * maxMovement
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={eyesRef} className='translate-y-1'>
            <svg width={42} height={42} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                {/* Left Eye */}
                <ellipse cx="8" cy="12" rx="4" ry="5" fill="white" />
                <ellipse
                    cx={8 + eyePosition.x}
                    cy={12 + eyePosition.y}
                    rx="2"
                    ry="3"
                    fill="#1F1F2E"
                />
                <circle
                    cx={7 + eyePosition.x}
                    cy={11 + eyePosition.y}
                    r="0.7"
                    fill="white"
                />

                {/* Right Eye */}
                <ellipse cx="16" cy="12" rx="4" ry="5" fill="white" />
                <ellipse
                    cx={16 + eyePosition.x}
                    cy={12 + eyePosition.y}
                    rx="2"
                    ry="3"
                    fill="#1F1F2E"
                />
                <circle
                    cx={15 + eyePosition.x}
                    cy={11 + eyePosition.y}
                    r="0.7"
                    fill="white"
                />
            </svg>
        </div>
    );
};

const LeaderboardHeader = () => {
    const [number, setNumber] = useState(500);
    const [targetNumber, setTargetNumber] = useState(500);
    const t = useTranslations("game")

    useEffect(() => {
        const calculateTargetFromTime = () => {
            const now = new Date();
            const minuteOfDay = now.getHours() * 60 + now.getMinutes();


            const baseValue = 600; // Center of the range
            const amplitude = 200; // How much it fluctuates (±200 from baseValue)
            const fullCycle = 120; // Complete cycle every 120 minutes (2 hours)

            // Convert minute of day to radians for the sine function
            const radians = (minuteOfDay % fullCycle) * (2 * Math.PI / fullCycle);

            // Calculate the target number using a sine wave
            const newTarget = Math.floor(baseValue + amplitude * Math.sin(radians));
            setTargetNumber(newTarget);
        };

        // Initial calculation
        calculateTargetFromTime();

        // Recalculate every minute to ensure synchronized values
        const interval = setInterval(calculateTargetFromTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Gradually move current number toward target number
    useEffect(() => {
        if (number === targetNumber) return;

        const animationInterval = setInterval(() => {
            setNumber(current => {
                const randomStep = Math.floor(Math.random() * 5) + 1;
                const direction = Math.random() < 0.5 ? -1 : 1;
                const step = randomStep * direction;

                if (current < targetNumber) {
                    return current + step;
                } else if (current > targetNumber) {
                    return current - step;
                }
                return current;
            });
        }, 1000); // Update every second as specified in your code

        return () => clearInterval(animationInterval);
    }, [number, targetNumber]);

    return (
        <div className='flex justify-between sticky top-0  pr-3 py-2'>
            <h2 className="text-xl font-semibold flex-1 pl-2 text-white">
                {t("leaderboard")}
            </h2>
            <div className="flex justify-between items-center">
                <span className="text-md font-semibold text-game-secondary ml-2">
                    {number} viewing
                </span>
            </div>
        </div>
    );
};

export default LeaderboardHeader;