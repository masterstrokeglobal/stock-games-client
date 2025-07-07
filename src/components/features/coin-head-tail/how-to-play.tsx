import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { X } from "lucide-react";

interface HowToPlayDialogProps {
    children: React.ReactNode;
    instructions?: string; // Optional: pass instructions as a prop if you want to make it dynamic
}

const DEFAULT_INSTRUCTIONS = `
1. Each round features 2 carefully selected stocks from the market.

2. Choose your side - Head or Tail - and place your bet before the round starts.

3. Watch as the coin flips and reveals which stock performed the best!

4. The winning stock is determined by which one had the highest percentage change during the round.

5. If the coin lands on your chosen side, congratulations! You win based on the payout multiplier.

6. Check your winnings and get ready for the next exciting round!
`;

const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
    children,
    instructions = DEFAULT_INSTRUCTIONS,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                showButton={false}
                overlayClassName="bg-[#00033D] bg-opacity-70"
                className="max-w-2xl w-full p-0 border-none bg-transparent backdrop-blur-md"
            >
                <div
                    style={{
                        background: 'linear-gradient(0deg, #0A023B 0%, #002A5A 90.29%)',
                    }}
                    className="w-full border backdrop-blur-md border-[#0074FF] rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF] bg-[#004DA9] justify-between p-4 pb-3 flex-shrink-0">
                        <div className="flex items-center text-white text-base font-semibold space-x-3">
                            How to Play?
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-0">
                        {/* Instructions */}
                        <div className="p-6">
                            <div className="text-white text-base font-semibold mb-4">
                                Instructions:
                            </div>
                            <div className="bg-[#004DA9B0] rounded-lg p-4 text-white text-sm whitespace-pre-line min-h-[200px] leading-relaxed">
                                {instructions}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HowToPlayDialog;