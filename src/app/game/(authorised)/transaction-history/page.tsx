'use client';
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";


const TransictionHistoryPage = () => {
    const [tab, setTab] = useState("deposit");

    const handleTabChange = (value: string) => {
        setTab(value);
    };

    return (
        <Container className="bg-primary-game relative flex flex-col pt-24 gap-12 items-center min-h-screen ">
            <img src="/top-gradient.svg" alt="logo" className="w-full absolute z-0 top-0 h-auto " />
            <TopBar>
                <span>
                    Transaction History
                </span>
            </TopBar>
            <Tabs defaultValue="deposit" className="w-full relative z-10">
                <TabsList className="w-full h-13 p-2">
                    <TabsTrigger className="flex-1" value="deposit">Deposit</TabsTrigger>
                    <TabsTrigger className="flex-1" value="withdraws">Withdraws</TabsTrigger>
                </TabsList>
            </Tabs>
        </Container>
    );
};


export default TransictionHistoryPage;