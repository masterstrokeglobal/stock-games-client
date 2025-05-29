import { Marquee } from "@/components/common/marquee";
import { useGetAdvertisements } from "@/react-query/advertisment-queries";
import { AdvertisementType } from "@/models/advertisment";

const AdMarquee = () => {
    const { data } = useGetAdvertisements({
        page: 1,
        limit: 10,
        search: "",
        active: "true",
        type: AdvertisementType.NOTICE,
    })

    const notice = data?.data?.companyBanners[0];   
    return (
        <Marquee pauseOnHover repeat={30} className="[--duration:5s] bg-[#256381] border-y-2 border-[#6d98ac] -mx-4 md:-mx-12" >
            <div className="flex items-center gap-2 ">
                {notice?.name || "Welcome to Stock Games"}
            </div>
        </Marquee>
    )
}

export default AdMarquee;