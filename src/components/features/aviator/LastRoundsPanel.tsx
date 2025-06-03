import { ChevronDown } from "lucide-react"

interface GameRound {
  id: number
  time: string
  multiplier: string
  duration: string
  status: "crashed" | "flew_away"
}

interface LastRoundsPanelProps {
  lastRounds: GameRound[]
}

export default function LastRoundsPanel({ lastRounds }: LastRoundsPanelProps) {
  const getMultiplierColor = (multiplier: string) => {
    const value = Number.parseFloat(multiplier.replace("x", ""))
    if (value >= 10) return "text-purple-400"
    if (value >= 5) return "text-green-400"
    if (value >= 2) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = (status: "crashed" | "flew_away") => {
    if (status === "crashed") {
      return <div className="w-2 h-2 bg-red-500 rounded-full" title="Crashed"></div>
    } else {
      return <div className="w-2 h-2 bg-blue-500 rounded-full" title="Flew Away"></div>
    }
  }

  return (
    <div className="w-full  bg-gray-900 bg-opacity-90 backdrop-blur-sm h-full flex flex-col overflow-x-auto">
      <div className="p-4 flex-none min-w-[320px]">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <ChevronDown className="h-5 w-5 text-white" />
            <span className="text-white font-bold">Last 12 Rounds</span>
          </div>
          <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-3 pb-2 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div>Time</div>
          <div className="text-center">Multi</div>
          <div className="text-center">Duration</div>
          <div className="text-center">Status</div>
        </div>
      </div>

      {/* Scrollable Rounds Table */}
      <div className="flex-1 overflow-y-auto px-4 min-w-[320px]">
        <div className="space-y-2">
          {lastRounds.map((round) => (
            <div
              key={round.id}
              className="grid grid-cols-4 gap-3 py-2 border-b border-gray-800 hover:bg-gray-800 hover:bg-opacity-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-gray-300 text-sm font-mono">{round.time}</span>
              </div>

              <div className="text-center">
                <span className={`text-sm font-bold ${getMultiplierColor(round.multiplier)}`}>
                  {round.multiplier}
                </span>
              </div>

              <div className="text-center">
                <span className="text-gray-300 text-sm font-mono">{round.duration}</span>
              </div>

              <div className="flex justify-center">
                {getStatusIcon(round.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats - Fixed at Bottom */}
      <div className="p-4 flex-none border-t border-gray-700 min-w-[320px]">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Multi</div>
            <div className="text-white font-bold">4.23x</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Duration</div>
            <div className="text-white font-bold">10.8s</div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Crashed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Flew Away</span>
          </div>
        </div>
      </div>
    </div>
  )
}