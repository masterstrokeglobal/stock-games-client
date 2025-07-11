import Link from "next/link";
import { IconRating18Plus } from "@tabler/icons-react";
import Logo from "@/components/common/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const NAV_LINKS = [
  {
    title: "Menu",
    links: [
      { href: "/game/platform", label: "Home" },
      { href: "/game/platform/promotion", label: "Promotions" },
      { href: "/game/platform/stock-games", label: "Stock Games" },
      { href: "/game/platform/casino", label: "Casino Games" },
      { href: "/game/platform/casino/slot-games", label: "Slot Games" },
      { href: "/game/platform/casino/live-games", label: "Live Casino" },
      { href: "/game/platform/tier", label: "Tiers" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "#", label: "Terms and conditions" },
      { href: "#", label: "Bonus Terms" },
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Responsible Gaming" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "#", label: "About Us" },
      { href: "#", label: "Affiliate Program" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "FAQ" },
      { href: "/game/contact", label: "Contact Us" },
    ],
  },
];

// Mobile accordion navigation using shadcn/ui Accordion
function FooterMobileNav() {
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
            Play Smart. Win Smarter.
            <span className="inline-block"><IconRating18Plus /></span>
          </div>
        </div>

        {/* Description and legal */}
        <div className="text-center  font-red text-platform-text/80 text-sm max-w-4xl mx-auto space-y-4">
          <p>
            Stock Games blends entertainment with strategic thinking — built for those who love a challenge and value financial awareness.<br /><br />
            Discover more about responsible gameplay and smart decision-making at <a href="https://investsmart.org" target="_blank" rel="noopener noreferrer" className="text-accent-secondary underline">InvestSmart.org</a>.
          </p>
          <p>
            Brought to you by Q Holdings Ltd.<br /><br />
            Infrastructure and payment services powered by 2024 Technologies Registration No: HE 565239B.
          </p>
          <p>
            Designed for the future of play.<br />
            Powered by data. Backed by responsibility.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-platform-text/60 text-xs mt-6">
          © 2023 Stock Games. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
