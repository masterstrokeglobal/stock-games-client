"use client"

import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { BetSlipItem, BetDirection } from "@/types"

interface BetSlipProps {
  betSlip: BetSlipItem[]
  open: boolean
  setOpen: (open: boolean) => void
  removeFromBetSlip: (id: string, direction: BetDirection) => void
  updateBetAmount: (id: string, direction: BetDirection, amount: number) => void
}

export function BetSlip({ betSlip, open, setOpen, removeFromBetSlip, updateBetAmount }: BetSlipProps) {
  // Calculate total bet amount and potential win
  const totalBetAmount = betSlip.reduce((sum, bet) => sum + bet.betAmount, 0)
  const totalPotentialWin = betSlip.reduce((sum, bet) => sum + bet.potentialWin, 0)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#1A1E2E] border-l border-[#2A2F42] p-0">
        <SheetHeader className="p-4 border-b border-[#2A2F42]">
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Bet Slip ({betSlip.length})</span>
            <button onClick={() => setOpen(false)}>
              <XIcon className="w-5 h-5" />
            </button>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {betSlip.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-lg font-medium mb-2">Your bet slip is empty</h3>
              <p className="text-sm text-gray-400">Click on UP or DOWN to add a bet to the slip</p>
            </div>
          ) : (
            <div className="space-y-4">
              {betSlip.map((bet) => (
                <div key={`${bet.id}-${bet.direction}`} className="bg-[#0F1221] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium">{bet.assetName}</div>
                      <div className="text-xs text-gray-400">{bet.assetSymbol}</div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => removeFromBetSlip(bet.id, bet.direction)}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    className={`flex items-center mb-3 ${bet.direction === "up" ? "text-green-400" : "text-red-400"}`}
                  >
                    {bet.direction === "up" ? (
                      <>
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                        <span>Price Up</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                        <span>Price Down</span>
                      </>
                    )}
                    <span className="ml-auto font-bold">1.96</span>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Bet Amount</label>
                      <input
                        type="number"
                        value={bet.betAmount}
                        onChange={(e) => updateBetAmount(bet.id, bet.direction, Number(e.target.value))}
                        className="w-full bg-[#2A2F42] border border-[#3A3F52] rounded p-2 text-white"
                      />
                    </div>
                    <div className="flex-1 ml-3">
                      <label className="text-xs text-gray-400 mb-1 block">Potential Win</label>
                      <div className="bg-[#2A2F42] border border-[#3A3F52] rounded p-2 text-white">
                        {bet.potentialWin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {betSlip.length > 0 && (
          <div className="border-t border-[#2A2F42] p-4">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Total Stake:</span>
              <span className="font-bold">{totalBetAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-400">Potential Win:</span>
              <span className="font-bold text-green-400">{totalPotentialWin.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Place Bet</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
