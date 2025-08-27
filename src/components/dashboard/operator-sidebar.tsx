"use client";
import { cn } from "@/lib/utils";
import { DollarSign, LucideIcon, UserCog2, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from '@/context/auth-context';
import Operator, { OperatorRole } from '@/models/operator';
import Logo from '../common/logo';
import { ScrollArea } from "../ui/scroll-area";

interface SubMenuItem {
    name: string;
    link: string;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    link?: string;
    subItems?: SubMenuItem[];
}

// Base operator menu items (available to all operator roles)
const baseOperatorMenuItems: MenuItem[] = [
    {
        name: 'Profile',
        icon: UserCog2,
        link: '/operator-dashboard/',
    },
    {
        name: 'Transactions',
        icon: DollarSign,
        link: '/operator-dashboard/transactions',
    },
   
];

// Additional menu items for Agent role only
const agentOnlyMenuItems: MenuItem[] = [
    {
        name: 'Users',
        icon: Users,
        subItems: [
            { name: 'View Users', link: '/operator-dashboard/users' },
            { name: 'Create User', link: '/operator-dashboard/create-user' },
        ],
    },
];

const manageOperatorMenuItems: MenuItem[] = [
    {
        name: 'Operators',
        icon: UserCog2,
        link: '/operator-dashboard/operator',
    },
];
// Function to get operator menu items based on role
const getOperatorMenuItems = (operatorRole: OperatorRole): MenuItem[] => {
    const menuItems = [...baseOperatorMenuItems];
    
    // Only agents get the "Create User" option
    if (operatorRole === OperatorRole.AGENT) {
        menuItems.push(...agentOnlyMenuItems);
    }
    else{
        menuItems.push(...manageOperatorMenuItems);
    }
    
    return menuItems;
};

interface PropsWithClassName {
    className?: string;
}

const Sidebar = ({ className }: PropsWithClassName) => {
    const { userDetails } = useAuthStore();
    const pathname = usePathname();

    // Type guard to ensure userDetails has operator properties
    const operatorDetails = userDetails as unknown as Operator;
    if (!operatorDetails?.role) {
        return null; // Handle case where operator details are not available
    }
    
    const menus = getOperatorMenuItems(operatorDetails.role);

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.link ||(item.subItems && item.subItems.some(subItem => pathname === subItem.link));

        if (item.subItems) {
            return (
                <AccordionItem value={item.name} key={item.name}>
                    <AccordionTrigger className={cn(
                        "flex items-center py-2 px-4 text-sm font-medium [&[data-state=open]]:text-black [&[data-state=open]]:bg-gray-200 [&[data-state=open]]:rounded-b-none rounded-md hover:bg-accent ",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}>
                        <span className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className='bg-gray-200 rounded-b-md pl-4'>
                        <div className="flex flex-col space-y-1 px-4">
                            {item.subItems.map((subItem) => (
                                <Link
                                    key={subItem.name}
                                    href={subItem.link}
                                    className={cn(
                                        "flex items-center py-2 px-2 text-sm font-medium rounded-md hover:bg-gray-300 hover:text-accent-foreground",
                                        "transition-colors duration-200",
                                        pathname === subItem.link && "bg-primary/50 text-accent-foreground"
                                    )}
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            );
        } else if (item.link) {
            return (
                <Link
                    key={item.name}
                    href={item.link}
                    className={cn(
                        "flex items-center py-2 px-4 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                        "transition-colors duration-200",
                        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                </Link>
            );
        }
        return null;
    };

    return (
        <div className={cn("flex  flex-col ", className)}>
            <ScrollArea className="h-full">
                <div className="flex h-16 items-center  px-4">
                    <Logo dark={false} />
                </div>
                <nav className="flex-1 overflow-y-auto pb-14 px-4 pt-8">
                    <Accordion type="multiple" className="w-full space-y-2">
                        {menus.map(renderMenuItem)}
                    </Accordion>
                </nav>
            </ScrollArea>
        </div>
    );
};

export default Sidebar;