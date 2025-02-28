"use client";


import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import { useGetMyCompany } from "@/react-query/company-queries";
import { PropsWithChildren } from "react";

const AuthLayout: React.FC = ({ children }: PropsWithChildren) => {
    const { data } = useGetMyCompany();


    return <div className="min-h-screen md:py-40 py-10 flex text-game-text justify-center items-center  bg-background-game">
        <nav className="items-center hidden uppercase md:flex fixed top-0 z-50 justify-center  font-semibold text-2xl w-full h-20 bg-primary-game ">
            <div className="text-white">
                {data?.name ?? "--"}
            </div>
            <div className="absolute right-4">
                <LocaleSwitcher />
            </div>
        </nav>
        <section className=" md:bg-primary-game px-4 w-full max-w-3xl md:border border-primary-game md:rounded-xl py-20 justify-center flex  h-auto bg-primary-game ">
            {children}
        </section>
    </div>;
};

export default AuthLayout;