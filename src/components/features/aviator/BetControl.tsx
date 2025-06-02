import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface BetControlProps {
  betAmount: string
  setBetAmount: (amount: string) => void
  autoPlay: boolean
  setAutoPlay: (enabled: boolean) => void
  onPlaceBet: (amount: string) => void
  disabled?: boolean
}

export default function BetControl({
  betAmount,
  setBetAmount,
  autoPlay,
  setAutoPlay,
  onPlaceBet,
  disabled = false,
}: BetControlProps) {
  const quickBetOptions = [
    { value: "500", label: "500" },
    { value: "2000", label: "2K" },
    { value: "5000", label: "5K" },
    { value: "15000", label: "15K" },
  ]

  return (
    <div className="space-y-4">
      <div className={`flex items-center bg-gray-900 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
        <div className="bg-yellow-400 rounded-full px-2 py-1 m-2">
          <span className="text-xs font-bold">₹</span>
        </div>
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="bg-transparent text-white w-full p-2 focus:outline-none"
          disabled={disabled}
        />
      </div>

      <Button
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => onPlaceBet(betAmount)}
        disabled={disabled}
      >
        {disabled ? 'BETTING CLOSED' : 'PLACE BET'}
      </Button>

      <div className="flex justify-between">
        {quickBetOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`bg-gray-700 hover:bg-gray-600 text-white border-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setBetAmount(option.value)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className={`flex items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
        <span className="text-white">Auto play</span>
        <Switch checked={autoPlay} onCheckedChange={setAutoPlay} disabled={disabled} />
      </div>
    </div>
  )
} 