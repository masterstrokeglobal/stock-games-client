import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useWindowSize from "@/hooks/use-window-size"
import { checkCasinoAllowed, cn, COMPANYID } from "@/lib/utils"
import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import WalletDialog from "./wallet-dialog"
import ContactDialog from "./contact-dialog"
import { 
    DatabaseIcon, 
    MaximizeIcon, 
    CreditCardIcon, 
    GiftIcon, 
    HeadphonesIcon, 
    HelpCircleIcon, 
    StarIcon, 
    VideoIcon, 
    GridIcon, 
    HomeIcon 
} from '../../common/sidebar-icons';

// Helper for sidebar icon component
const SidebarIconComponent = ({ Icon, className }: { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className?: string }) => (
    <Icon className={className} />
);

const navItems = [
    { icon: HomeIcon, label: "Home", href: "/game/platform" },
    { icon: DatabaseIcon, label: "Stock Market", href: `/game/platform/stock-games` },
    { icon: StarIcon, label: "Tiers", href: "/game/platform/tier" },
    { icon: CreditCardIcon, label: "Wallet", href: "#", Parent: WalletDialog },
    { icon: GiftIcon, label: "Promotions", href: "/game/platform/promotion" },
    { icon: HelpCircleIcon, label: "How to Play", href: "/game/platform/how-to-play" },
    { icon: HeadphonesIcon, label: "Support — Call Now!", Parent: ContactDialog },
];

const casinoItems = [
    { icon: MaximizeIcon, label: "Casino Games", href: "/game/platform/casino" },
    { icon: GridIcon, label: "Slot Games", href: `/game/platform/casino/slot-games` },
    { icon: VideoIcon, label: "Live Casino", href: `/game/platform/casino/live-games` },
];

const withCasino = [...navItems];
withCasino.splice(2, 0, ...casinoItems);

interface SidebarProps {
    className?: string;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

type SidebarItemType = {
    icon: React.ComponentType<any>;
    label: string;
    href: string;
    Parent?: React.ComponentType<any>;
};

const Sidebar = ({ className, sidebarOpen, toggleSidebar }: SidebarProps) => {
    const pathname = usePathname()
    const { isMobile } = useWindowSize();
    const router = useRouter();

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    const onClick = (item: SidebarItemType) => {
        if (isMobile) {
            setTimeout(() => {
                toggleSidebar();
            }, 500);
        }
        if (!item.Parent) {
            router.push(item.href);
        }
    };
    const sideBarItems = isCasinoAllowed ? withCasino : navItems;
    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen  bg-background-secondary dark:bg-primary-game md:border-r border-platform-border transition-all duration-300 ease-in-out z-40",
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
                        {!sidebarOpen ? <SidebarOpenIcon className="text-platform-text" size={20} /> : <SidebarCloseIcon className="text-platform-text" size={20} />}
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <nav className={cn("space-y-1 px-2 py-4", !sidebarOpen && "hidden md:block")}>
                        <TooltipProvider>
                            {sideBarItems.map((item, index) => {
                                const isActive = pathname === item.href

                                if (item.Parent) {
                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <item.Parent>
                                                    <SidebarItem item={item as SidebarItemType} isActive={isActive} sidebarOpen={sidebarOpen} />
                                                </item.Parent>
                                            </TooltipTrigger>
                                        </Tooltip>
                                    )
                                }
                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <SidebarItem item={item} isActive={isActive} sidebarOpen={sidebarOpen} onClick={() => onClick(item)} />
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

const SidebarItem = ({
    item,
    isActive,
    sidebarOpen,
    onClick,
}: {
    item: SidebarItemType,
    isActive: boolean,
    sidebarOpen: boolean,
    onClick?: () => void
}) => {
    return (
        <button
            className={cn(
                "flex items-center cursor-pointer w-full gap-3 rounded-md px-3 py-2 text-sm font-medium text-platform-text hover:bg-platform-border hover:text-platform-text group",
                isActive && "bg-platform-border "
            )}
            onClick={onClick}
            type="button"
        >
            <SidebarIconComponent
                Icon={item.icon}
                className={cn(
                    "flex-shrink-0 text-platform-text group-hover:text-platform-text",
                    sidebarOpen ? "h-5 w-5" : "h-6 w-6"
                )}
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
    )
}
export default Sidebar