import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const Header = ({ className }: PropsWithClassName) => {
    return <header className={cn("flex justify-between max-w-[1440px] xl:gap-8  mx-auto w-full items-center", className)}>
        <h1 className="font-audiowale lg:text-xl font-bold">Hi - Lo</h1>
      
        <Link href="/game/single-player/jackpot/setting" >
            <Button className="bg-[#008CB3]" size={"icon"}>
                <MenuIcon className="text-white" />
            </Button>
        </Link>
    </header>
}

export default Header;