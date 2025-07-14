import { cn } from "@/lib/utils";

interface SevenUpDownChipProps {
    side: "up" | "down" | "seven";
    className?: string;
}

const SevenUpDownChip = ({ side, className }: SevenUpDownChipProps) => {
    // Color and label mapping
    const config = {
        up: {
            color: "#0BAC00",
            label: "7 Up"
        },
        down: {
            color: "#9B0519",
            label: "7 Down"
        },
        seven: {
            color: "#C8AA01",
            label: "7"
        }
    }[side];

    return (
        <div className={cn("flex md:gap-2 xs:gap-1 gap-0.5 items-center", className)}>
            <span style={{ backgroundColor: config.color }} className={"size-3 rounded-full"}></span>
            <span className="text-white  select-none whitespace-nowrap">
                {config.label}
            </span>
        </div>
    );
};

export default SevenUpDownChip;