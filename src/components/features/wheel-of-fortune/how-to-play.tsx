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
1. Each round features 21 carefully selected stocks from the market.

2. Choose your favorite color and place your bet before the round starts.

3. Watch as the wheel spins and reveals which stock performed the best!

4. The winning stock is determined by which one had the highest percentage change during the round.

5. If the wheel lands on your chosen color, congratulations! You win based on the payout multiplier.

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
                className="max-w-lg w-full p-0 border-none bg-transparent backdrop-blur-md"
            >
                <div
                    style={{
                        background:
                            "linear-gradient(0deg, rgba(31, 41, 41, 0.9) 0%, rgba(43, 70, 67, 0.9) 90.29%)",
                    }}
                    className="w-full border backdrop-blur-md border-[#5C8983] rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#5C8983] bg-[#366D51] justify-between p-6 pb-4">
                        <div className="flex items-center text-white text-lg font-medium">
                            How to Play?
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Instructions */}
                        <div>
                            <div className="text-white text-base font-semibold mb-2">
                                Instructions:
                            </div>
                            <div className="bg-[#223C38] border border-[#5C8983] rounded-lg p-4 text-white text-sm whitespace-pre-line min-h-[200px]">
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