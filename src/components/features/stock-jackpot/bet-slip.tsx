"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { RoundRecord } from "@/models/round-record"
import { useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface BetSlipProps {
  open: boolean
  setOpen: (open: boolean) => void
  roundRecord: RoundRecord
}

export function BetSlip({ roundRecord, open, setOpen }: BetSlipProps) {
    const {data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord.id)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#1A1E2E] border-l border-[#2A2F42] p-0">
        <SheetHeader className="p-4 border-b border-[#2A2F42]">
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Bet Slip ({stockSlotPlacements?.length || 0})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {stockSlotPlacements?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-lg font-medium mb-2 text-white">Your bet slip is empty</h3>
              <p className="text-sm text-gray-400">Click on UP or DOWN to add a bet to the slip</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stockSlotPlacements?.map((stockSlotPlacement) => (
                <div key={`${stockSlotPlacement.id}`} className="bg-[#0F1221] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium text-white">{stockSlotPlacement.marketItem.name}</div>
                      <div className="text-xs text-gray-400">{stockSlotPlacement.marketItem.codeName}</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center mb-3 ${stockSlotPlacement.placement === "high" ? "text-green-400" : "text-red-400"}`}
                  >
                    {stockSlotPlacement.placement  === "high" ? (
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
                    <span className="ml-auto font-bold">2</span>
                  </div>

                  <div className="flex items-center"> 
                    <div className="flex-1 ml-3">
                      <label className="text-xs text-gray-400 mb-1 block">Potential Win</label>
                      <div className="bg-[#2A2F42] border border-[#3A3F52] rounded p-2 capitalize text-white">
                     from {stockSlotPlacement.amount} to {(stockSlotPlacement.amount * 2).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {stockSlotPlacements?.length && stockSlotPlacements?.length > 0 && (
          <div className="border-t border-[#2A2F42] p-4">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Total Stake:</span>
              <span className="font-bold text-white">{stockSlotPlacements?.reduce((acc, placement) => acc + placement.amount, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4"> 
              <span className="text-gray-400">Potential Win:</span>
              <span className="font-bold text-green-400">{stockSlotPlacements?.reduce((acc, placement) => acc + placement.amount, 0) * 2 }</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
