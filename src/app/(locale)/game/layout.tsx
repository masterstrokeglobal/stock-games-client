"use client";
import { useGetMyCompany } from "@/react-query/company-queries";
import { useEffect } from "react";

const GameLayout = ({ children }: { children: React.ReactNode }) => {
    const { data: company } = useGetMyCompany();

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

    return <>{children}</>;
};

export default GameLayout;
