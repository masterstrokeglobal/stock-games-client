import { PropsWithChildren } from "react";

const AuthLayout: React.FC = ({ children }: PropsWithChildren) => {
    return <div className="min-h-screen md:py-40 py-10 flex justify-center items-center  md:bg-[radial-gradient(69.35%_50%_at_50%_50%,_rgba(10,_22,_52,_0.6693)_0%,_rgba(10,_22,_52,_0.97)_100%)]  md:bg-primary/20 bg-primary-game">
        <nav className="items-center hidden md:flex fixed top-0 justify-center text-white font-semibold text-2xl w-full h-20 bg-primary-game ">
            STOCK DERBY
        </nav>
        <section className=" md:bg-[linear-gradient(180deg,_#0A1634_0%,_#10224F_100%)] px-4 w-full max-w-3xl md:border border-[#3799ED7A] md:rounded-3xl py-20 justify-center flex  h-auto bg-primary-game ">
            {children}
        </section>
    </div>;
};

export default AuthLayout;