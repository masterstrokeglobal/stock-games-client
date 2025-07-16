"use client";
import Navbar from "@/components/features/game/navbar";
import BottomNavbar from "@/components/features/platform/bottom-navbar";
import Footer from "@/components/features/platform/footer";
import Sidebar from "@/components/features/platform/sidebar";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useState } from "react";


export default function GamingAppInterface({ children }: PropsWithChildren) {
    const { isMobile } = useWindowSize();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(!isMobile)
    }, [isMobile])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }
    console.log(sidebarOpen,"sidebarOpen")
    return (
        <div className="flex flex-col min-h-screen relative bg-background-game dark:bg-primary-game text-white   mx-auto">
            <Navbar />
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} className="h-[100svh] pt-14" />
            {/* platform menu and account */}
            <BottomNavbar toggleSidebar={toggleSidebar} activeMenu={sidebarOpen} />
            <div className={cn("flex-1 mt-14  pt-5 transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-20")}>
                <main className="w-full md:px-12 sm:px-4 px-2">
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    )
}