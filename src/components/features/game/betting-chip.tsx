import { Chip, CHIP_COLORS } from "./contants";

interface BettingChipsProps {
    chips: Chip[];
}

export const BettingChips: React.FC<BettingChipsProps> = ({ chips }) => {
    return (
        <>
            {chips.map((chip, index) => (
                <div
                    key={index}
                    className={`
                        absolute w-12 h-12 -mt-6 -ml-6 rounded-full border-4
                        flex items-center justify-center text-white font-bold text-sm
                        transform hover:scale-110 transition-all shadow-lg
                        ${CHIP_COLORS[chip.amount.toString()] || 'bg-blue-500 border-blue-600'}
                    `}
                    style={{
                        left: chip.x,
                        top: chip.y,
                        zIndex: 10 + index,
                    }}
                >
                    ${chip.amount}
                    {chip.display && <span className="text-xs">{chip.display}</span>}
                </div>
            ))}
        </>
    );
};
