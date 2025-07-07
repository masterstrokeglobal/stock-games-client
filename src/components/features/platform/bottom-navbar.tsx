import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GiftIcon, MenuIcon, SearchIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        label: "Promotions",
        icon: GiftIcon,
        href: "/game/platform/promotion"
    },
    {
        label: "Tier",
        icon: StarIcon,
        href: "/game/platform/tier"
    },
    {
        label: "Search",
        icon: SearchIcon,
        href: "/game/platform/casino"
    },

    
]

const BottomNavbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const pathname = usePathname();
    const checkActive = (path: string) => {
        return pathname === path
    }
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-primary-game border-t border-platform-border  md:hidden grid grid-cols-4 justify-around py-2 z-50">
            <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" aria-label="Collapse sidebar" className="flex flex-col gap-2 h-fit" onClick={toggleSidebar}>
                    <MenuIcon className="w-5 h-5" />
                </Button>
            </div>
            {menuItems.map((item) => (
                <div key={item.href} className="flex items-center justify-center gap-2">
                    <Link href={item.href} className={cn(checkActive(item.href) ? "active-menu-button text-white rounded-md" : "text-gray-400")}>
                        <Button variant="ghost" aria-label="Collapse sidebar" className="flex flex-col gap-2 pb-2 h-fit">
                            <item.icon className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default BottomNavbar;