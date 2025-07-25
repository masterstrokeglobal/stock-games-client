"use client";
import { useTranslations } from "next-intl";


const useFooterLinks = () => {
    const t = useTranslations("platform.footer");
    return [
        {
            title: t("menu"),
            links: [
                { href: "/game/platform", label: t("home") },
                { href: "/game/platform/promotion", label: t("promotions") },
                { href: "/game/platform/stock-games", label: t("stock-games") },
                { href: "/game/platform/casino", label: t("casino-games") },
                { href: "/game/platform/casino/slot-games", label: t("slot-games") },
                { href: "/game/platform/casino/live-games", label: t("live-games") },
                { href: "/game/platform/tier", label: t("tiers") },
            ],
        },
        {
            title: t("policies"),
            links: [
                { href: "#", label: t("terms-and-conditions") },
                { href: "#", label: t("bonus-terms") },
                { href: "#", label: t("privacy-policy") },
                { href: "#", label: t("responsible-gaming") },
            ],
        },
        {
            title: t("platform"),
            links: [
                { href: "#", label: t("about-us") },
                { href: "#", label: t("affiliate-program") },
            ],
        },
        {
            title: t("support"),
            links: [
                { href: "/game/platform/faq", label: t("faq") },
                { href: "/game/platform/contact", label: t("contact-us") },
            ],
        },
    ];
}

export default useFooterLinks;