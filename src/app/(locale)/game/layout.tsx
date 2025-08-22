"use client";
import { useGetMyCompany } from "@/react-query/company-queries";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GameLayout = ({ children }: { children: React.ReactNode }) => {
    const { data: company } = useGetMyCompany();
    const pathName = usePathname();

    useEffect(() => {
        if (company) {
            // Update favicon
            const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (favicon) {
                favicon.href = company.logo ?? "/logo.png";
            } else {
                const newFavicon = document.createElement("link");
                newFavicon.rel = "icon";
                newFavicon.href = company.logo ?? "/logo.png";
                document.head.appendChild(newFavicon);
            }

            // Update title
            document.title = company.name ?? "--";
        }
    }, [company]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (pathName !== "/game/platform") {
                window.Tawk_API?.hideWidget();
            } else {
                window.Tawk_API?.showWidget();
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [pathName]);
    return <>{children}</>;
};

export default GameLayout;
