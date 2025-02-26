
// components/BettingControls.tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface BettingControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    onPlaceBet: () => void;

    isLoading: boolean;
    isPlaceOver: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    betAmount,
    setBetAmount,
    isPlaceOver,
    isLoading,
    onPlaceBet
}) => {
    const t = useTranslations('game');
    return (
        <div className="max-w-4xl mx-auto bg-tertiary  p-4 rounded-2xl">
            <div className="flex justify-center relative mb-2">
                <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                    <img src="/coin.svg" className='shadow-custom-glow rounded-full' alt="coin" />
                </div>
                <Input
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="bg-[#101F44] p-2 text-white rounded-2xl pl-14 h-14 text-xl"
                    disabled={isPlaceOver}
                />
            </div>

            <div className="flex justify-between items-center mb-2">
                <div className="flex justify-between gap-1 w-full xl:flex-nowrap flex-wrap">
                    {[100, 500, 1000, 2000, 3000].map((amount) => (
                        <Button
                            className='flex-1'
                            variant="game-secondary"
                            key={amount}

                            onClick={() => setBetAmount(amount)}
                            disabled={isPlaceOver}
                        >
                            ₹{amount}
                        </Button>
                    ))}
                </div>
            </div>
            <button

                className={`bet-button w-full ${isPlaceOver || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPlaceOver || isLoading}
                onClick={onPlaceBet}
            >
                {isPlaceOver ? t('betting-closed').toUpperCase() : isLoading ? t('please-wait').toUpperCase() : t('bet').toUpperCase()}
            </button>
        </div>
    );
};

