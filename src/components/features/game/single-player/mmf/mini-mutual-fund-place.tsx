import { Button } from '@/components/ui/button';
import { useIsPlaceOver } from '@/hooks/use-current-game';
import { useStockBettingStore } from '@/store/betting-store';
import { useSinglePlayerGameStore } from '@/store/single-player-game-store';

// Custom shiny gold button styles
const accentButton = `
  relative overflow-hidden
  bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00]
  text-white font-bold rounded-xl 
  transition-all duration-300
  hover:brightness-110 hover:scale-105
  focus:outline-none focus:ring-2 focus:ring-[#FFD700]/60
  disabled:opacity-50 disabled:cursor-not-allowed
  shadow-[0_0_15px_rgba(255,215,0,0.3)]
  border border-[#FFD700]/30
`;

const inputStyle = `
  relative overflow-hidden
  bg-gradient-to-br from-[#1a1f2e] to-[#2a3142]
  text-white 
  placeholder:text-gray-400 
  font-semibold rounded-2xl 
  focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 
  transition-all duration-200 
  pl-14 h-14 text-xl w-full
  shadow-[0_0_20px_rgba(255,215,0,0.1)]
  border border-[#FFD700]/20
  backdrop-blur-sm
`;

const BetInputForm = () => {
  const { roundRecord } = useSinglePlayerGameStore();
  const { betAmount, isLoading, setBetAmount } = useStockBettingStore();
  const isPlaceOver = useIsPlaceOver(roundRecord ?? null);

  if (!roundRecord) return null;

  return (
    <div className="max-w-md min-w-96 mx-auto p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
        Place Your Bet
      </h2>
      
      {/* Quick amount selection buttons */}
      <div className="flex justify-between flex-wrap gap-3 mb-6">
        {[100, 500, 1000, 1500, 2000].map((amount) => (
          <Button
            className={`flex-1 min-w-[80px] h-11 ${accentButton} text-base`}
            variant="ghost"
            key={amount}
            onClick={() => setBetAmount(amount)}
            disabled={isPlaceOver || isLoading}
          >
            <span className="relative z-10">₹{amount}</span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </Button>
        ))}
      </div>

      {/* Betting amount input with coin icon */}
      <div className="flex justify-center relative">
        <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full flex items-center">
          <img
            src="/coin.svg"
            className="w-10 h-10 rounded-full"
            alt="coin"
            style={{
              filter: "drop-shadow(0 0 12px #FFD700)",
            }}
          />
        </div>
        <div className="relative w-full">
          <input
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className={inputStyle}
            disabled={isPlaceOver || isLoading}
            type="number"
            min={0}
          />
          {/* Input shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default BetInputForm;