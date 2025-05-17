"use client";

import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

const AuthLayout: React.FC = ({ children }: PropsWithChildren) => {
    const router = useRouter();

    return (
        <div className="min-h-screen overflow-hidden  flex text-game-text justify-center pt-20 items-center h-screen bg-background-secondary">
            {/* Navigation Bar */}
            <nav className="items-center  uppercase flex fixed top-0 z-50 justify-center font-semibold text-2xl w-full h-20 bg-primary-game">
                <Button variant={'ghost'} className="absolute left-4" onClick={() => router.back()}>
                    <ArrowLeft size={20} className="text-white" />
                </Button>
                <div className="text-white">
                    <Logo />
                </div>
                <div className="absolute right-4">
                    <LocaleSwitcher />
                </div>
            </nav>

            {/* Main Content Container */}
            <section className="bg-primary-game shadow-2xl shadow-game-secondary px-6 md:rounded-2xl  max-w-6xl w-full md:shadow-lg md:border border-primary-game  flex flex-col md:flex-row h-full md:h-[80svh]">
                {/* Left side - Image (hidden on very small screens, visible from sm breakpoint up) */}
                <div className="hidden sm:block md:w-1/2  relative">
                    <div className="absolute inset-0 rounded-xl  md:relative h-full">
                        <img
                            src="/images/auth-image.png"
                            alt="Authentication image"
                            className="w-full h-full object-cover object-top  relative md:rounded-l-xl"
                        />
                    </div>
                </div>

                <ScrollArea className="w-full md:w-1/2  items-center justify-center ">
                    <div className="w-full flex flex-col py-14 items-center justify-center h-full">
                        {children}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </section>
        </div>
    );
};

export default AuthLayout;