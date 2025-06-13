import { Button } from "@/components/ui/button"

interface BetControlProps {
  betAmount: number,
  setBetAmount: (amount: number) => void
  onPlaceBet: (amount: number) => void
  onCashOut: () => void
  isPlaced?: boolean,
  isCashoutdone?: boolean,
  cashOutAmount: number
  cashOutDisabled?: boolean
  disabled?: boolean
}

export default function BetControl({
  betAmount,
  setBetAmount,
  onPlaceBet,
  onCashOut,
  isPlaced = false,
  isCashoutdone = false,
  cashOutAmount,
  disabled = false,
  cashOutDisabled = false,
}: BetControlProps) {
  const quickBetOptions = [
    { value: 500, label: "500" },
    { value: 2000, label: "2K" },
    { value: 5000, label: "5K" },
    { value: 15000, label: "15K" },
  ]

  return (
    <div className="space-y-4 w-full">
      <div className={`flex items-center bg-gray-900 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
        <div className="bg-yellow-400 rounded-full px-2 py-1 m-2">
          <span className="text-xs font-bold">₹</span>
        </div>
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="bg-transparent text-white w-full p-2 focus:outline-none"
          disabled={disabled || isPlaced}
        />
      </div>

      {isPlaced ? (
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={onCashOut}
          disabled={cashOutDisabled}
        >
          {isCashoutdone ? "CASHED OUT" : "CASH OUT " + cashOutAmount}
        </Button>
      ) : (
        <Button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onPlaceBet(betAmount)}
          disabled={disabled}
        >
          {disabled ? 'BETTING CLOSED' : 'PLACE BET'}
        </Button>
      )}

      <div className="flex justify-between">
        {quickBetOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`bg-gray-700 hover:bg-gray-600 text-white border-none ${(disabled || isPlaced) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setBetAmount(option.value)}
            disabled={disabled || isPlaced}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}