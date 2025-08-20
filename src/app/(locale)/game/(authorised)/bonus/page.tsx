import Container from "@/components/common/container";
import Navbar from "@/components/features/game/navbar";
import BonusSummaryComponent from "@/components/features/bonus/bonus-summary";

const UserBonusPage = () => {
    return (
        <Container className="bg-primary-game md:pt-24 pt-12">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                <BonusSummaryComponent />
            </div>
        </Container>
    )
}

export default UserBonusPage;
