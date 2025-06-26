import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface HowToPlayDialogProps {
    children: React.ReactNode;
    instructions?: string;
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
            <DialogContent showButton={false} className="max-w-3xl xs:w-[95vw] bg-[#140538] w-full p-0 border-none backdrop-blur-md">
                <div
                    style={{
                        background: 'linear-gradient(180deg, #1B1E4B 0%, #23245A 100%)',
                    }}
                    className="w-full border border-[#4061C0] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#4467CC] bg-[#140538] justify-between px-6 py-4 flex-shrink-0">
                        <div className="flex items-center text-white text-center text-lg flex-1 justify-center font-bold w-full">
                            Game Rules                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="py-4 flex-1 relative px-4 overflow-hidden border-x-[1.5rem] border-b-[1.5rem] border-[#140538] flex flex-col">
                        <Image src="/images/dice-game/table-bg.png" alt="dice-1" fill />
                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-[#520B8E] bg-opacity-30" />
                        <div className="relative z-10 text-white p-4">
                            <div className="text-white text-base font-semibold mb-4">
                                Instructions:
                            </div>
                            <div className="text-white text-sm whitespace-pre-line leading-relaxed">
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