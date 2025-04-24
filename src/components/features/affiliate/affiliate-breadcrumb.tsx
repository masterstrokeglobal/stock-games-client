import { useGetAffiliateById } from "@/react-query/affiliate-queries";
import { useAuthStore } from "@/context/auth-context";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { HomeIcon, Slash } from "lucide-react";
import Link from "next/link";

type Props = {
    affiliateId: string;
};

const AffiliateBreadcrumb = ({ affiliateId }: Props) => {
    const { userDetails } = useAuthStore();
    const { data: affiliate, isLoading } = useGetAffiliateById(affiliateId);

    console.log(affiliate);
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard/affiliate/profile" className="flex items-center gap-2">
                            <HomeIcon className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator>
                    <Slash className="h-4 w-4" />
                </BreadcrumbSeparator>

                {userDetails?.name && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/affiliate">
                                <span>{userDetails.name}</span>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator>
                            <Slash className="h-4 w-4" />
                        </BreadcrumbSeparator>
                    </>
                )}

                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {isLoading ? "Loading..." : affiliate?.data?.affiliate?.name || "Affiliate"}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default AffiliateBreadcrumb;