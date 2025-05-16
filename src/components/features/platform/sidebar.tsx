import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { GameCategory } from "@/models/casino-games"
import {
    IconCoins,
    IconDice,
    IconGift,
    IconHeadphones,
    IconHelpCircle,
    IconHome,
    IconLayoutGrid,
    IconMedal2,
    IconVideo,
    IconWallet
} from "@tabler/icons-react"
import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
    { icon: IconHome, label: "Home", href: "/game/platform" },
    { icon: IconCoins, label: "Stock Market", href: `/game/platform/stock-games` },
    { icon: IconDice, label: "Casino Games", href: "/game/platform/casino" },
    { icon: IconLayoutGrid, label: "Table Games", href: `/game/platform/casino/${GameCategory.TABLE_GAMES}` },
    { icon: IconVideo, label: "Live Casino", href: `/game/platform/casino/${GameCategory.LIVE}` },
    { icon: IconMedal2, label: "Tiers", href: "/game/platform/tier" },
    { icon: IconWallet, label: "Wallet", href: "/game/wallet/menu" },
    { icon: IconGift, label: "Promotions", href: "/game/platform/promotion" },
    { icon: IconHelpCircle, label: "How to Play", href: "/game/platform/how-to-play" },
    { icon: IconHeadphones, label: "Support — Call Now!", href: "/game/contact" },
]

interface SidebarProps {
    className?: string;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ className, sidebarOpen, toggleSidebar }: SidebarProps) => {
    const pathname = usePathname()
    const { isMobile } = useWindowSize();
    const router = useRouter();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen  bg-background-secondary border-r-2 border-gray-600 transition-all duration-300 ease-in-out z-40",
                sidebarOpen ? "md:w-64 w-full" : "md:w-20 w-0",
                !sidebarOpen && "w-0 md:w-20",
                className
            )}
        >
            <div className="flex h-full flex-col">
                <div className="hidden md:flex justify-end p-2 sticky top-0  z-10">
                    <Button
                        onClick={toggleSidebar}
                        variant="ghost"
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {!sidebarOpen ? <SidebarOpenIcon size={20} /> : <SidebarCloseIcon size={20} />}
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <nav className={cn("space-y-1 px-2 py-4", !sidebarOpen && "hidden md:block")}>
                        <TooltipProvider>
                            {navItems.map((item, index) => {
                                const isActive = pathname === item.href
                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <button
                                                className={cn(
                                                    "flex items-center cursor-pointer w-full gap-3 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-[#1a2942] hover:text-secondary-game group",
                                                    isActive && "bg-[#1a2942] text-secondary-game"
                                                )}
                                                onClick={() => {

                                                    if (isMobile) {
                                                        setTimeout(() => {
                                                            toggleSidebar();
                                                        }, 500);
                                                    }
                                                    router.push(item.href);

                                                }}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "flex-shrink-0 text-secondary-game group-hover:text-secondary-game",
                                                        sidebarOpen ? "h-5 w-5" : "h-6 w-6"
                                                    )}
                                                    stroke={1.5}
                                                />
                                                {
                                                    sidebarOpen && (
                                                        <span
                                                            className={cn(
                                                                "transition-opacity duration-200",
                                                                sidebarOpen ? "opacity-100" : "opacity-0 hidden md:block",
                                                            )}
                                                        >
                                                            {item.label}
                                                        </span>
                                                    )
                                                }
                                            </button>
                                        </TooltipTrigger>
                                        {!sidebarOpen && (
                                            <TooltipContent side="right">
                                                {item.label}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                )
                            })}
                        </TooltipProvider>
                    </nav>
                </ScrollArea>
            </div>
        </aside>
    )
}

export default Sidebar