"use client";

import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import Image from "next/image";

const AuthLayout: React.FC = ({ children }: PropsWithChildren) => {
    const router = useRouter();

    return (
        <div className="min-h-screen overflow-hidden  flex text-game-text justify-center pt-20 items-center h-screen bg-background-secondary p-5">
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
            <section className="bg-white shadow-game-secondary p-6 md:p-4 md:rounded-[50px] max-w-6xl w-full md:border border-primary-game flex flex-col md:flex-row h-full md:h-[80svh]">
                {/* Left side - Image (hidden on very small screens, visible from sm breakpoint up) */}
                <div className="hidden sm:block md:w-1/2  relative">
                    <div className="absolute inset-0 rounded-xl  md:relative h-full">
                        <img
                            src="/images/auth-img.png"
                            alt="Authentication image"
                            className="h-full object-cover object-top  relative md:rounded-l-xl"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-around h-full">
                     <Image src="/images/logo.png" alt="Authentication image" width={100} height={100} />
                    <div className="w-full h-full overflow-y-auto flex felx-col justify-center">
                        {children}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthLayout;