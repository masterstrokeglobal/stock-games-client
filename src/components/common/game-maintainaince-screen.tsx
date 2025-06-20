import { cn } from "@/lib/utils";
import { Marquee } from "./marquee";

const GameMaintenanceMarquee = ({className}:PropsWithClassName) => {
    return (
        <Marquee repeat={10}  pauseOnHover className={cn("[--duration:5s] bg-secondary flex items-center justify-center",className)}>
            <div className="text-center gap-4 min-w-[20vw] bg-secondary text-secondary-foreground font-semibold">
                GAME IS UNDER MAINTAINCE.  PLEASE TRY AGAIN LATER
            </div>
        </Marquee>
    );
}

export default GameMaintenanceMarquee;