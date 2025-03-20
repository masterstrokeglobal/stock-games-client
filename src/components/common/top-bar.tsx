import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

interface TopBarProps extends PropsWithChildren {
    rightContent?: React.ReactNode;
    leftContent?: React.ReactNode;
}

const TopBar = ({ children, rightContent, leftContent }: TopBarProps) => {
    const router = useRouter();
    
    const handleBack = () => {
        router.back();
    }

    return (
        <section className="bg-primary-game fixed top-0 w-full z-50  -mx-4 sm:-mx-8 xl:-mx-12">
            <nav className="items-center flex relative justify-between text-top-bar-text font-semibold w-full h-20 px-4">
                {leftContent ? leftContent : (<Button size="icon" variant="ghost" onClick={handleBack}>
                    <ArrowLeft size={24} />
                </Button>)}
                <div>
                    {children}
                </div>
                <div className="min-w-10 flex items-center justify-end">
                    {rightContent}
                </div>
            </nav>
            <div
                className="h-0.5 bottom-0 absolute w-full"
                style={{
                    background: "radial-gradient(51.91% 51.91% at 48.09% 91.82%, #2397FA 0%, rgba(35, 151, 250, 0) 100%)"
                }}
            />
        </section>
    );
};

export default TopBar;