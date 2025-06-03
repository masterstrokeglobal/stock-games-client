import { useGameType } from "@/hooks/use-game-type"
import { useAviatorRoundHistory } from "@/react-query/aviator-queries"
import dayjs from "dayjs"
import { ChevronDown } from "lucide-react"

export default function LastRoundsPanel() {
  const [gameType] = useGameType();
  const { data: lastRounds } = useAviatorRoundHistory(gameType);

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
    <div className="w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm h-full flex flex-col overflow-x-auto">
      <div className="p-4 flex-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <ChevronDown className="h-5 w-5 text-white" />
            <span className="text-white font-bold">Last 12 Rounds</span>
          </div>
          <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Table */}
        <div className="w-full min-w-[320px]">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                <th className="pb-2 text-left">Time</th>
                <th className="pb-2 text-center">Name</th>
                <th className="pb-2 text-center">Multi</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {lastRounds?.map((round) => (
                <tr
                  key={`${round.roundId}-${round.code}`}
                  className="hover:bg-gray-800 hover:bg-opacity-50 transition-colors"
                >
                  <td className="py-2">
                    <span className="text-gray-300 text-sm font-mono whitespace-nowrap">{dayjs(round.time).format("hh:mm a")}</span>
                  </td>
                  <td className="py-2 text-center cursor-pointer" title={round.name}>
                    <span className="text-gray-300 text-sm font-mono whitespace-nowrap w-24 block truncate">{round.name}</span>
                  </td>
                  <td className="py-2 text-center">
                    <span className={`text-sm font-bold ${getMultiplierColor(round.multiplier.toString())}`}>{round.multiplier}</span>
                  </td>
                  <td className="py-2">
                    <div className="flex justify-center">
                      {getStatusIcon(round.status as "crashed" | "flew_away")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats - Fixed at Bottom */}
      <div className="p-4 mt-auto border-t border-gray-700 min-w-[320px]">
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