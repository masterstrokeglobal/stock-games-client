import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface StockGameHeaderProps {
    onBack: () => void;
    title: string;
    className?: string;
}

const StockGameHeader = ({ onBack, title, className }: StockGameHeaderProps) => {
    return (
        <header className={cn("border-b border-accent-secondary w-full py-2 ", className)}>
            <div className="flex items-center justify-between">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    size="icon"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1 flex justify-center">
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>
            </div>
        </header>
    )
}

export default StockGameHeader;