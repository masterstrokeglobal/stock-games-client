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
1. Each round features 12 carefully selected stocks from the market.

2. Six stocks are assigned to each dice, with each face representing a particular stock.

3. Choose your lucky number (2-12) and place your bet before the round starts.

4. Watch as the dice roll and reveal which stocks performed the best!

5. The winning stocks are determined by the highest percentage change during the round.

6. Each dice counts as a winner, and the sum of both dice becomes the winning number.

7. If you bet on the correct number, congratulations! You win based on the payout multiplier shown.

8. Check your winnings and get ready for the next exciting round!
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
                className="max-w-lg w-full p-0 border-none rounded border-[#003682]  border-2 bg-transparent backdrop-blur-md"
            >
                <div
                  
                    className="w-full border backdrop-blur-md border-[#2E3A6A] rounded-md shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#2E3A6A] bg-[#140538] justify-between p-6 pb-4">
                        <div className="flex items-center text-white text-center justify-center flex-1 text-lg font-medium">
                            How to Play?
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="border-x-[1.5rem] border-b-[1.5rem]  bg-[#00215ff0] backdrop-blur-lg border-[#140538]">
                        {/* Instructions */}
                        <div>
                            <div className="text-white text-base font-semibold p-4 mb-2">
                                Instructions:
                            </div>
                            <div className="  rounded-none p-4 text-white text-sm whitespace-pre-line min-h-[200px]">
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