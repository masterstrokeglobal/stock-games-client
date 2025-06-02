import LightningBackground from "@/components/ui/lightningBg"
import { PropsWithChildren } from "react"

const RedBlackLayout = ({ children }: PropsWithChildren) => {
    return (
        <LightningBackground>
            {children}
        </LightningBackground>
    )
}

export default RedBlackLayout;
