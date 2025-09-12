import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PropsWithChildren } from "react";



const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
        {...props}
    >
        <rect
            width="17.408"
            height="2.691"
            x="9.988"
            y="9.592"
            fill="#fff"
            rx="1.345"
        ></rect>
        <rect
            width="17.408"
            height="2.691"
            x="9.988"
            y="14.713"
            fill="#fff"
            rx="1.345"
        ></rect>
        <rect
            width="17.408"
            height="2.691"
            x="9.988"
            y="19.836"
            fill="#fff"
            rx="1.345"
        ></rect>
        <rect
            width="2.877"
            height="2.691"
            x="4.68"
            y="9.592"
            fill="#fff"
            rx="1.345"
        ></rect>
        <rect
            width="2.877"
            height="2.691"
            x="4.68"
            y="14.713"
            fill="#fff"
            rx="1.345"
        ></rect>
        <rect
            width="2.877"
            height="2.691"
            x="4.68"
            y="19.836"
            fill="#fff"
            rx="1.345"
        ></rect>
    </svg>
);


const Header = ({ className, children }: PropsWithClassName<PropsWithChildren>) => {
    return <header className={cn("flex justify-between lg:px-8 sm:px-4 px-2 xl:gap-8  mx-auto w-full items-center", className)}>
        <h1 className="font-audiowale lg:text-xl font-bold">Hi - Lo</h1>
        {
            children
        }
        <Link href="/game/single-player/jackpot/setting" >
            <Button className="bg-[#008CB3]" size={"icon"}>
                <MenuIcon />
            </Button>
        </Link>
    </header>
}

export default Header;