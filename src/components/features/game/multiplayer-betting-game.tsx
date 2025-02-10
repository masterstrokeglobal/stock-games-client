
// components/BettingControls.tsx
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface BettingControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    onPlaceBet: () => void;

    isLoading: boolean;
    isPlaceOver: boolean;
    isGameOver: boolean;
    joiningCode: string;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    isPlaceOver,
    isLoading,
    joiningCode,
    isGameOver,
    onPlaceBet
}) => {
    const t = useTranslations('game');
    return (
        <div className="max-w-4xl w-full mx-auto bg-[#1A2D58] p-4 rounded-2xl">
            {!isGameOver ? <button
                className={`bet-button w-full ${isPlaceOver || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPlaceOver || isLoading}
                onClick={onPlaceBet}
            >
                {isPlaceOver ? t('betting-closed').toUpperCase() : isLoading ? t('please-wait').toUpperCase() : t('bet').toUpperCase()}
            </button>
                :
                <Link href={`/game/lobby/${joiningCode}`}>
                    <button
                        className={`bet-button w-full`}
                    >
                        Back to Lobby
                    </button>
                </Link>}
        </div>
    );
};

