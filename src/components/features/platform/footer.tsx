import Link from "next/link";
import { IconRating18Plus } from "@tabler/icons-react";
import Logo from "@/components/common/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useFooterLinks from "@/hooks/use-footer-link";
import { useTranslations } from "next-intl";


// Mobile accordion navigation using shadcn/ui Accordion
function FooterMobileNav() {
  const NAV_LINKS = useFooterLinks();
  return (
    <div className="w-full md:hidden mb-8">
      <Accordion type="multiple" className="w-full">
        {NAV_LINKS.map((section) => (
          <AccordionItem value={section.title} key={section.title} className="border-none border-transparent">
            <AccordionTrigger className="font-semibold text-platform-text py-4 px-2">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="pl-2 pr-2 pb-2 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white text-[#747487] block py-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Desktop grid navigation
function FooterDesktopNav() {
  const NAV_LINKS = useFooterLinks();
  return (
    <div className="w-full hidden md:grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-8">
      {NAV_LINKS.map((section) => (
        <div key={section.title}>
          <div className="font-semibold mb-3">{section.title}</div>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:underline text-[#747487]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("platform.footer");
  return (
    <footer className="w-full  pt-10 pb-4  font-platform-text text-platform-text text-base">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top navigation: Accordion for mobile, grid for desktop */}
        <FooterMobileNav />
        <FooterDesktopNav />

        {/* Crypto icons row */}
        <div className="flex flex-col items-center gap-8">
          <div className="w-full h-px bg-gradient-to-r from-[#040029] via-[#4467CC] to-[#040029]"></div>
          <img src="/images/banner/payments.png" alt="Bitcoin" className="h-auto md:h-12 w-[80%] md:w-auto" />
          <div className="w-full h-px bg-gradient-to-r from-[#040029] via-[#4467CC] to-[#040029]"></div>
        </div>

        {/* Logo and tagline */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Logo className="text-platform-text" textClassName="text-platform-text" />
          <div className="font-semibold text-[15px] flex items-center gap-1">
            {t("play-smart-win-smarter")}
            <span className="inline-block"><IconRating18Plus /></span>
          </div>
        </div>

        {/* Description and legal */}
        <div className="text-center  font-red text-platform-text/80 text-sm max-w-4xl mx-auto space-y-4">
          <p>
            {t("stock-games-blends-entertainment")}<br /><br />
            {t("discover-more-about-responsible-gameplay")} <a href="https://investsmart.org" target="_blank" rel="noopener noreferrer" className="text-accent-secondary underline">{t("investsmart-org")}</a>.
          </p>
          <p>
            {t("brought-to-you-by-q-holdings-ltd")}<br /><br />
            {t("infrastructure-and-payment-services-powered-by-2024-technologies-registration-no-he-565239b")}
          </p>
          <p>
            {t("designed-for-the-future-of-play")}<br />
            {t("powered-by-data")}. {t("backed-by-responsibility")}.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-platform-text/60 text-xs mt-6">
          © {new Date().getFullYear()} Stock Games. {t("all-rights-reserved")}
        </div>
      </div>
    </footer>
  );
}
