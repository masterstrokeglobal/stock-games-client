"use client"

import LoadingScreen from "@/components/common/loading-screen";
import { useAuthStore } from "@/context/auth-context";
import { AdminRole } from "@/models/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function HomePage() {
    const { userDetails, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {

        console.log(userDetails);
        if (!loading && userDetails) {
            const currentUser = userDetails as any;
            if (currentUser.role === AdminRole.AGENT) {
                router.push('/dashboard/agent');
            }

            if (currentUser.role === AdminRole.SUPER_ADMIN) {
                router.push('/dashboard/users');
            }

            if (currentUser.role === AdminRole.COMPANY_ADMIN) {
                router.push('/dashboard/users');
            }
        }
    }, [userDetails, router]);
    return (
        <LoadingScreen className="min-h-screen" />
    )
}

export default HomePage;
