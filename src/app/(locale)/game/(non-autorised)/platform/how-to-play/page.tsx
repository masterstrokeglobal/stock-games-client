"use client";

import { useState } from "react";

const TAB_ICONS = [
  "/images/how-to-play/tier.png",
  "/images/how-to-play/wallet.png",
  "/images/how-to-play/quick-tio.png",
  "/images/how-to-play/faq.png",
  "/images/how-to-play/play-now.png",
];

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Tab Components with better left-aligned content
function TierInfoTab() {
  return (
    <div className="flex flex-col h-full text-platform-text text-sm sm:text-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⭐</span>
        <h3 className="text-xl font-semibold">Tier Information</h3>
      </div>
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">How Tiers Work</h4>
          <p className="text-platform-text/80 leading-relaxed">
            Unlock higher tiers by earning more points and completing challenges. Each tier offers exclusive rewards and benefits that enhance your gaming experience.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Tier Progression</h4>
          <div className="flex items-center gap-2 text-platform-text/80">
            <span>Bronze</span>
            <span>→</span>
            <span>Silver</span>
            <span>→</span>
            <span>Gold</span>
            <span>→</span>
            <span>Platinum</span>
            <span>→</span>
            <span>Diamond</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-platform-text/80">
            <li>Higher withdrawal limits</li>
            <li>Exclusive bonuses and rewards</li>
            <li>Priority customer support</li>
            <li>Special tournament access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function WalletTab() {
  return (
    <div className="flex flex-col h-full text-platform-text text-sm sm:text-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💰</span>
        <h3 className="text-xl font-semibold">How Wallet Works</h3>
      </div>
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Getting Started</h4>
          <p className="text-platform-text/80 leading-relaxed">
            Deposit funds to start playing and earning rewards. Our secure payment system ensures your money is always safe.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Withdrawals</h4>
          <p className="text-platform-text/80 leading-relaxed">
            Withdraw your winnings anytime to your bank account or UPI. Fast and secure processing guaranteed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Minimum Withdrawal</h4>
            <p className="text-platform-text/80">₹500</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Processing Time</h4>
            <p className="text-platform-text/80">24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickTipTab() {
  return (
    <div className="flex flex-col h-full text-platform-text text-sm sm:text-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💡</span>
        <h3 className="text-xl font-semibold">Quick Tips</h3>
      </div>
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">For Beginners</h4>
          <ul className="list-disc list-inside space-y-1 text-platform-text/80">
            <li>Start with small bets to understand the game mechanics</li>
            <li>Set a budget and stick to it - never chase losses</li>
            <li>Take regular breaks to maintain focus and decision-making</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Advanced Strategies</h4>
          <ul className="list-disc list-inside space-y-1 text-platform-text/80">
            <li>Study market trends and patterns for better predictions</li>
            <li>Analyze historical data to identify patterns</li>
            <li>Join community discussions to learn from experienced players</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FAQTab() {
  return (
    <div className="flex flex-col h-full text-platform-text text-sm sm:text-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">❓</span>
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
      </div>
      <div className="max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-platform-border">
            <AccordionTrigger className="text-left hover:no-underline">
              How do I start playing?
            </AccordionTrigger>
            <AccordionContent className="text-platform-text/80">
              Register an account, complete your profile verification, and deposit funds to begin your gaming journey. Our platform is designed to be user-friendly for both beginners and experienced players.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b border-platform-border">
            <AccordionTrigger className="text-left hover:no-underline">
              Is my money safe?
            </AccordionTrigger>
            <AccordionContent className="text-platform-text/80">
              Yes, absolutely! We use industry-standard secure payment gateways and encryption protocols. Your financial information is protected with bank-level security measures.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b border-platform-border">
            <AccordionTrigger className="text-left hover:no-underline">
              What are the withdrawal limits?
            </AccordionTrigger>
            <AccordionContent className="text-platform-text/80">
              Minimum withdrawal amount is ₹500. Maximum limits depend on your tier level - higher tiers have higher withdrawal limits. Contact support for specific limits based on your account.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b border-platform-border">
            <AccordionTrigger className="text-left hover:no-underline">
              How long does verification take?
            </AccordionTrigger>
            <AccordionContent className="text-platform-text/80">
{`              Account verification typically takes 24-48 hours. Make sure to provide clear, valid documents to speed up the process. You'll receive an email notification once verified.
`}            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b border-platform-border">
            <AccordionTrigger className="text-left hover:no-underline">
              Can I play on mobile?
            </AccordionTrigger>
            <AccordionContent className="text-platform-text/80">
              Yes! Our platform is fully responsive and works great on mobile devices. For the best experience, we recommend downloading our mobile app available on both iOS and Android.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function PlayNowTab() {
  return (
    <div className="flex flex-col h-full text-platform-text text-sm sm:text-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">▶️</span>
        <h3 className="text-xl font-semibold">Ready to Play?</h3>
      </div>
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Join the Community</h4>
          <p className="text-platform-text/80 leading-relaxed">
            Join thousands of players and start your winning journey! Our community is growing every day with players from all over the world.
          </p>
        </div>
        <Link href="/game/platform">
       <Button
        className="w-full mt-4"
        size="lg"
        variant="platform-gradient-secondary"
       >
        Play Now
       </Button>
       </Link>
      </div>
    </div>
  );
}


const TABS = [
  {
    label: "Tier info",
    icon: TAB_ICONS[0],
    component: TierInfoTab,
  },
  {
    label: "How Wallet Works",
    icon: TAB_ICONS[1],
    component: WalletTab,
  },
  {
    label: "Quick Tip",
    icon: TAB_ICONS[2],
    component: QuickTipTab,
  },
  {
    label: "FAQ",
    icon: TAB_ICONS[3],
    component: FAQTab,
  },
  {
    label: "Play Now",
    icon: TAB_ICONS[4],
    component: PlayNowTab,
  },
];

export default function GameGuideUI() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = TABS[activeTab].component;

  return (
    <div className="min-h-screen w-full text-platform-text flex flex-col items-center">
      <div className="w-full mx-auto">
        {/* Header */}
        <header className="pt-4 sm:pt-6 ">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Game Guide</h1>
        </header>

        {/* Tab Navigation */}
        <div className="w-full flex flex-col items-center mb-4">
          <div className="flex items-center justify-between w-full  sm:px-8 py-2 sm:py-4 relative">
            {/* Horizontal line */}
            <div className="absolute top-[calc(50%-0.5rem)] md:left-14  left-8 sm:left-16 right-6 sm:right-8 h-0.5 bg-yellow-400 w-[calc(100%-4rem)] sm:w-[calc(100%-9rem)]" style={{ transform: "translateY(-50%)" }} />
            <div className="flex w-full justify-between items-start relative z-10">
              {TABS.map((tab, idx) => (
                <div key={tab.label} className="w-fit">
                  <button
                    onClick={() => setActiveTab(idx)}
                    className={`flex flex-col items-center focus:outline-none group transition-all`}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <div
                      className={`rounded-full p-2 sm:p-3 border-2 transition-all mb-1
                        ${activeTab === idx ? "border-yellow-400 bg-[#E6F6FF]" : "border-transparent"}
                      `}
                    >
                      <img
                        src={tab.icon}
                        alt={tab.label}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-center transition-all line-clamp-1 ">
                      {tab.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full px-4 py-6 sm:py-8 border-2 min-h-52 flex items-center justify-center border-platform-border">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}