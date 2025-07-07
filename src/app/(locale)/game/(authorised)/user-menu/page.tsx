import Container from "@/components/common/container";
import Navbar from "@/components/features/game/navbar";
import UserMenu from "@/components/features/user-menu/page";

const UserMenuPage = () => {
    return (
        <Container className="bg-primary-game md:pt-24 pt-12">
            <Navbar />
            <UserMenu />
        </Container>
    )
}

export default UserMenuPage;
