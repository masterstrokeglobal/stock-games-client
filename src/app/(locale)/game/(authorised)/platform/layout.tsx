"use client";
import Navbar from "@/components/features/game/navbar";
import { Button } from "@/components/ui/button";
import { HelpCircle, MegaphoneIcon, MenuIcon, MessageCircle, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

export default function GamingAppInterface({ children }: PropsWithChildren) {
    const tcontact = useTranslations('contact');

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex flex-col min-h-screen relative bg-primary-game text-white   mx-auto">
            <Navbar />
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} className="h-[100svh] pt-14" />
            {/* platform menu and account */}
            <div className="fixed bottom-0 left-0 right-0 bg-primary-game border-t border-gray-800 md:hidden flex justify-around py-2 z-50">
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" aria-label="Collapse sidebar" onClick={toggleSidebar}>
                        <MenuIcon className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Link href="/game/platform/promotions">
                        <Button variant="ghost" aria-label="Collapse sidebar">
                            <MegaphoneIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Link href="/game/user-menu">
                        <Button variant="ghost" aria-label="Collapse sidebar">
                            <UserIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className={cn("flex-1 mt-14 pt-5 transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-20")}>
                <main className="w-full px-12">
                    {children}
                    <div className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
                        <div className="mt-auto rounded-lg  p-6 text-center   mx-auto w-full border-purple-200/20 shadow-md">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <HelpCircle className="w-5 h-5 " />
                                <h3 className="font-bold text-lg">{tcontact('need-assistance')}</h3>
                            </div>
                            <p className="text-sm text-gray-200 mb-3">{tcontact('support-team-available')}</p>
                            <div className="flex items-center justify-center gap-4 mt-4  mb-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="youtube" className="w-5 h-5 text-[#FF0000]" />
                                <img src="/images/instagram.png" alt="instagram" className="w-5 h-5 text-[#FF0000]" />
                                <img src="/images/twitter.png" alt="facebook" className="w-5 h-5 bg-white rounded-full p-0.5" />
                                <img src="/images/facebook.png" alt="twitter" className="w-5 h-5 bg-white rounded-full text-[#FF0000]" />
                            </div>
                            <Link href="/game/contact">
                                <Button
                                    className="mt-2 w-full text-sm py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2 bg-transparent"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {tcontact('contact-support')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}



import Sidebar from "@/components/features/platform/sidebar";
import { cn } from "@/lib/utils";

