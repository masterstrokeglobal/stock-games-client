import { ScrollArea } from "@/components/ui/scroll-area"

const GameRule = () => {
    return <div className="max-w-xl mx-auto rounded-2xl" style={{ backgroundColor: '#003B4952' }}>
        <ScrollArea className="h-[40vh] pr-2" scrollThumbClassName="bg-[#C7F4FF80]">
            <div className="space-y-4 p-4 text-white">
                <div>
                    <h3 className="text-white font-medium mb-2">Step 1: Choose Your Stock</h3>
                    <p className="text-white">Select from numerous market items/stocks available for betting. Each stock displays its current price.</p>
                </div>
                <div>
                    <h3 className="text-white font-medium mb-2">Step 2: Place Your Prediction</h3>
                    <p className="text-white">Bet on whether the stock price will go UP or DOWN. You have 30 seconds to place your bet after the round starts.</p>
                </div>
                <div>
                    <h3 className="text-white font-medium mb-2">Step 3: Wait for Price Movement</h3>
                    <p className="text-white">Each game round lasts 1 minute total. After the betting window closes (30 seconds), watch the stock price movement for the remaining 30 seconds.</p>
                </div>
                <div>
                    <h3 className="text-white font-medium mb-2">Step 4: Collect Results</h3>
                    <p className="text-white">Based on whether the stock price went up or down compared to your prediction, you will either win or lose. Winnings are automatically added to your account balance.</p>
                </div>
                <div>
                    <h3 className="text-white font-medium mb-2">Betting Options:</h3>
                    <ul className="space-y-2 ml-4 text-white">
                        <li className="text-white">• UP: Predict stock price will increase (2x payout)</li>
                        <li className="text-white">• DOWN: Predict stock price will decrease (2x payout)</li>
                        <li className="text-white">• Betting window: First 30 seconds of each round</li>
                        <li className="text-white">• Price tracking: Last 30 seconds of each round</li>
                    </ul>
                </div>
            </div>
        </ScrollArea>
    </div>
}

export default GameRule;