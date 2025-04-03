
// components/BettingControls.tsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useUndoLastPlacement } from '@/react-query/game-record-queries';
import { useAuthStore } from '@/context/auth-context';

interface BettingControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    roundId: number;
    isLoading: boolean;
    isPlaceOver: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    betAmount,
    setBetAmount,
    isPlaceOver,
    roundId,
    isLoading,
}) => {
    const t = useTranslations('game');
    const { userDetails } = useAuthStore();

    const { mutate, isPending } = useUndoLastPlacement();

    const handleUndo = () => {
        mutate(roundId.toString());
    }
    return (
        <div className="max-w-4xl mx-auto bg- text-game-text p-4 rounded-2xl">
            <div className="flex justify-center relative mb-2">
                <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                    <img src="/coin.svg" className='shadow-custom-glow rounded-full' alt="coin" />
                </div>
                <Input
                    min={userDetails?.company?.minPlacement}
                    max={userDetails?.company?.maxPlacement}
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className=" p-2  rounded-2xl pl-14 h-14 border-2 border-game-text text-xl"
                    disabled={isPlaceOver}
                />
            </div>

            <div className="flex justify-between items-center mb-2">
                <div className="flex justify-between gap-1 w-full xl:flex-nowrap flex-wrap" >
                    {[100, 500, 1000, 2000].map((amount) => (
                        <Button
                            className='flex-1 text-game-text bg-secondary-game'
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
            <Button
                className={`bg-primary-game w-full ${isPlaceOver || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPlaceOver || isLoading || isPending}
                onClick={handleUndo}
            >
                {isPlaceOver ? t('betting-closed').toUpperCase() : isLoading ? t('please-wait').toUpperCase() : t('undo').toUpperCase()}
            </Button>
        </div>
    );
};

