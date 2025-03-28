import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarDropBackground = ({ className }: PropsWithClassName) => {
    return (
        <div className={cn("w-full h-full bg-background-last-winner relative overflow-hidden", className)}>
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                    >
                        <Star className="fill-yellow-500" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StarDropBackground;
