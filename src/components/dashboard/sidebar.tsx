"use client";
import { cn } from "@/lib/utils";
import { Building, Clock, Contact2, DollarSign, Home, LucideIcon, Repeat1, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from '@/context/auth-context';
import Admin, { AdminRole } from '@/models/admin';
import Logo from '../common/logo';

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
const adminMenuItems: MenuItem[] = [
{
    name: 'Admins',
    icon: Users,
    subItems: [
        { name: 'View Admins', link: '/dashboard/admins' },
        { name: 'Create Admin', link: '/dashboard/admins/create' },
    ],
},
{
    name: 'Company',
    icon: Building,
    subItems: [
        { name: 'View Companies', link: '/dashboard/company' },
        { name: 'Create Company', link: '/dashboard/company/create' },
    ],
},
{
    name: 'Users',
    icon: Users,
    link: '/dashboard/users',
},
{
    name: 'Market Items',
    icon: Users,
    link: '/dashboard/market-items',
}, {
    name: "holiday",
    icon: DollarSign,
    link: '/dashboard/holiday'
},
{
    name: "Round Records",
    icon: Repeat1,
    link: '/dashboard/round-records'
}
];

const companyMenuItems: MenuItem[] = [


{
    name: 'Users',
    icon: Users,
    link: '/dashboard/users',
},
//agents
{
    name: 'Agents',
    icon: Users,
    subItems: [
        { name: 'View Agents', link: '/dashboard/agents' },
        { name: 'Create Agent', link: '/dashboard/agents/create' },
    ],
},
{
    name: 'Scheduler',
    icon: Clock,
    subItems: [
        { name: 'View Schedule', link: '/dashboard/scheduler' },
        { name: 'Create Schedule', link: '/dashboard/scheduler/create' },
    ]
},

{
    name: 'Transactions',
    icon: DollarSign,
    link: '/dashboard/transactions',
},
{
    name: "Contact Queries",
    icon: Contact2,
    link: '/dashboard/contact'
}
];

const agentMenuItems: MenuItem[] = [
{ name: 'Dashboard', icon: Home, link: '/dashboard/agent' },
{
    name: 'Users',
    icon: Users,
    link: '/dashboard/agent-users',
},
{
    name: "Profit/Loss",
    icon: DollarSign,
    link: '/dashboard/agent-profit-loss'
}
];



const Sidebar = ({ className }: PropsWithClassName) => {
let { userDetails } = useAuthStore();
const pathname = usePathname();

userDetails = userDetails as Admin;
let menus = userDetails?.isSuperAdmin ? adminMenuItems : companyMenuItems;
if (userDetails.role === AdminRole.AGENT) {
    menus = agentMenuItems;
}

console.log(userDetails);
const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.link ||
        (item.subItems && item.subItems.some(subItem => pathname === subItem.link));

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
        <div className="flex h-16 items-center  px-4">
            <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pt-8">
            <Accordion type="multiple" className="w-full space-y-2">
                {menus.map(renderMenuItem)}
            </Accordion>
        </nav>
    </div>
);
};

export default Sidebar;