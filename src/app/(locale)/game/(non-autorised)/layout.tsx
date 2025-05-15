"use client";
import useGameUserLogin from "@/hooks/use-game-user-login";
import { useGetMyCompany } from "@/react-query/company-queries";
import Head from "next/head";
import { PropsWithChildren } from "react";

const NonAuthenticatedGameLayout = ({ children }: PropsWithChildren) => {
    const { data: company } = useGetMyCompany();

    useGameUserLogin();

    return <>
        <Head>
            <link rel="icon" href={company?.logo ?? "/logo.png"} />
            <title>{company?.name ?? "--"}</title>
        </Head>

        <div className="bg-background-game">{children}</div>
    </>
};

export default NonAuthenticatedGameLayout;
