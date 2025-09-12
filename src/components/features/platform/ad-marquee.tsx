import { Marquee } from "@/components/common/marquee";
import { COMPANYID } from "@/lib/utils";
import { AdvertisementType } from "@/models/advertisment";
import { useGetAdvertisements } from "@/react-query/advertisment-queries";

const AdMarquee = () => {
    const { data } = useGetAdvertisements({
        page: 1,
        limit: 10,
        search: "",
        active: "true",
        type: AdvertisementType.NOTICE,
        companyId: COMPANYID.toString()
    })

    const notice = data?.data?.companyBanners[0];
    if (!notice) return null;
    return (
        <Marquee pauseOnHover repeat={30} className="[--duration:5s] dark:bg-[linear-gradient(to_bottom,#7286DF_9.23%,#351ECA_90.09%)] text-platform-text bg-background-secondary border-primary-game  border-y-2 dark:border-nonw -mx-4 md:-mx-12" >
            <div className="flex items-center gap-2 ">
                {notice?.name || "Welcome to Platform"}
            </div>
        </Marquee>
    )
}

export default AdMarquee;