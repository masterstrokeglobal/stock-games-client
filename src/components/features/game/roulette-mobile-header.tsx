import { useGameState } from '@/hooks/use-current-game';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';

const GameHeaderMobile = ({
    roundRecord,
    className = "",
}: { roundRecord: RoundRecord, className?: string }) => {
    const gameState = useGameState(roundRecord);

    const getTime = () => {
        if (gameState.isGameOver) {
            return "00:00";
        }
        return gameState.isPlaceOver
            ? gameState.gameTimeLeft.formatted
            : gameState.placeTimeLeft.formatted;
    };

    const getTimeInSeconds = () => {
        const timeStr = getTime();
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    // The timer is a countdown from 60 seconds
    const totalTime = 90;
    const timeLeft = getTimeInSeconds();
    const progress = timeLeft / totalTime;

    // Circle parameters
    const size = 40; // Reduced size
    const strokeWidth = 4; // Reduced stroke width
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    if (!gameState.isPlaceOver) {
        return null;
    }
    return (
            <div className={cn('relative flex-shrink-0', className)} style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="block"
                    style={{ display: 'block' }}
                >
                    {/* Empty circle background */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#1E3A8A"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#3B82F6"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="butt" // Changed from round to butt
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: 'stroke-dashoffset 1s linear',
                        }}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>
                {/* Timer text in center - only show when placement is over */}
                {gameState.isPlaceOver && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-normal" style={{ fontFamily: 'inherit' }}>
                            {getTime()}
                        </span>
                    </div>
                )}
            </div>
    );
};

export default GameHeaderMobile;