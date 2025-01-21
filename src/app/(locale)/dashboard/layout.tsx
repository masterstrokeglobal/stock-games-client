"use client";
import {
    ArrowLeft,
    CircleUser,
    Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "@/components/dashboard/sidebar"
import { PropsWithChildren, useEffect } from "react"
import { useAuthStore } from "@/context/auth-context"
import LoadingScreen from "@/components/common/loading-screen"
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import useLogin from "@/hooks/use-login";
import { useAdminLogout } from "@/react-query/admin-auth-queries";

const DashboardLayout = ({ children }: PropsWithChildren) => {
    const { loading, userDetails } = useAuthStore();
    const { mutate } = useAdminLogout();
    const router = useRouter();
    useLogin();
    useEffect(() => {
        if (!loading && !userDetails) {
            router.push("/login");
        }
    }, [userDetails, loading, router]);

    if (!userDetails) {
        return <LoadingScreen className="h-screen" />
    }

    return (
        <div className="min-h-screen bg-[#f5f7f9] w-full md:p-4 ">
            <Sidebar className="h-screen hidden md:block w-64 absolute top-0 left-0" />
            <ScrollArea className="flex flex-col md:ml-64 bg-white relative h-[calc(100vh-32px)] border md:rounded-xl ">
                <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:h-16 lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                    <Button variant="secondary"   onClick={() => router.back()}>
                        <ArrowLeft className="size-4 mr-2" />
                        <span >Go back</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full ml-auto">
                                <CircleUser className="size-4 mr-2" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    mutate();
                                }}
                            >Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </ScrollArea>
        </div>
    )
}

export default DashboardLayout;