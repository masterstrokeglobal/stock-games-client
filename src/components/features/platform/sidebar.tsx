import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import {  SidebarCloseIcon, SidebarOpenIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import {
    CreditCardIcon,
    DatabaseIcon,
    GiftIcon,
    GridIcon,
    HeadphonesIcon,
    HomeIcon,
    MaximizeIcon,
    StarIcon,
    VideoIcon
} from '../../common/sidebar-icons'
import ContactDialog from "./contact-dialog"
import WalletDialog from "./wallet-dialog"
import { IconCricket } from "@tabler/icons-react"

// Helper for sidebar icon component
const SidebarIconComponent = ({ Icon, className }: { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className?: string }) => (
    <Icon className={className} />
);


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
    const t = useTranslations("platform.sidebar");
    const navItems = [
        { icon: HomeIcon, label: t("home"), href: "/game/platform" },
        { icon: DatabaseIcon, label: t("stock-market"), href: `/game/platform/stock-games` },
        { icon: StarIcon, label: t("tiers"), href: "/game/platform/tier" },
        { icon: CreditCardIcon, label: "Wallet", href: "#", Parent: WalletDialog },
        { icon: GiftIcon, label: t("promotions"), href: "/game/platform/promotion" },
        { icon: HeadphonesIcon, label: t("support"), Parent: ContactDialog },
    ];
    
    const casinoItems = [
        { icon: MaximizeIcon, label: t("casino-games"), href: "/game/platform/casino" },
        { icon: IconCricket as any, label: t("gap-games"), href: "/game/platform/gap" },
        { icon: GridIcon, label: t("slot-games"), href: `/game/platform/casino/slot-games` },
        { icon: VideoIcon, label: t("live-games"), href: `/game/platform/casino/live-games` },
    ];
    
    const withCasino = [...navItems];
    withCasino.splice(2, 0, ...casinoItems);
    
    const pathname = usePathname()
    const { isMobile } = useWindowSize();
    const router = useRouter();

    const {isCasinoAllowed} = useCasinoAllowed();

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
        <>
        {isMobile && sidebarOpen && (
            <div
                className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
                onClick={toggleSidebar}
                aria-label="Close sidebar overlay"
            />
        )}
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen  bg-background-secondary dark:bg-primary-game md:border-r border-platform-border transition-all duration-300 ease-in-out z-40",
                sidebarOpen ? "md:w-64 w-[calc(70vw)]" : "md:w-20 w-0",
                !sidebarOpen && "w-0 md:w-20",
                className
            )}
        >
            <div className="flex h-full flex-col">
                <div className={cn("hidden md:flex p-2 sticky top-0  z-10", !sidebarOpen ? "justify-center" : "justify-end")   }>
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
</>
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
                "flex items-center cursor-pointer group w-full gap-3 rounded-md px-3 py-2 text-sm font-medium text-platform-text transition-all duration-300 ease-in-out hover:text-gray-200 hover:text-platform-text group",
                isActive && "bg-platform-border ",
                !sidebarOpen && "justify-center"
            )}
            onClick={onClick}
            type="button"
        >
            <SidebarIconComponent
                Icon={item.icon}
                className={cn(
                    "flex-shrink-0 text-platform-text group-hover:text-gray-500 transition-all duration-300 ease-in-out ",
                    sidebarOpen ? "h-5 w-5" : "h-6 w-6"
                )}
            />
            {
                sidebarOpen && (
                    <span
                        className={cn(
                            "transition-opacity duration-200 group-hover:text-gray-500",
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