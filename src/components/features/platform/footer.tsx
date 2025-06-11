import { Card, CardContent } from "@/components/ui/card";
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandYoutube, IconMessage2 } from "@tabler/icons-react";

export default function Footer() {
  return (
    <section className="flex flex-col my-12 md:pb-0 pb-12   gap-4">
      <div className="flex justify-center gap-4  text-xl">
        <IconMessage2 />
        <IconBrandFacebook />
        <IconBrandX />
        <IconBrandInstagram />
        <IconBrandYoutube />
      </div>
    <footer className="text-white  border-t border-accent-secondary py-6 text-center text-sm">

      <div className="grid grid-cols-2  w-fit  mx-auto  mb-6">
        <img src="/images/coins/usdc.jpg" alt="USDC" className="h-12 grayscale" />
        <img src="/images/coins/bitcoin.png" alt="Bitcoin" className="h-8 grayscale" />
        <img src="/images/coins/ethereum.png" alt="Ethereum" className="h-8 grayscale" />
        <img src="/images/coins/tron.png" alt="Tron" className="h-8 grayscale" />
      </div>

      <Card className="bg-transparent border-none text-white max-w-xl mx-auto">
        <CardContent className="space-y-4 p-0">
          <p>
            Stock Games is committed to responsible financial education and entertainment. For resources on financial literacy and responsible gameplay, visit InvestSmart.org
          </p>
          <p>
            Stock Games is owned and operated by Q. For support, contact us at support@stockgames.com.
            Our payment and processing services are managed by 2024, Registration number: HE 565239B
          </p>
          <div className="space-y-1">
            <p>Support: <a href="mailto:support@stockgames.com" className="text-accent-secondary underline">support@stockgames.com</a></p>
            <p>Partners: <a href="mailto:partners@stockgames.com" className="text-accent-secondary underline">partners@stockgames.com</a></p>
            <p>Press: <a href="mailto:press@stockgames.com" className="text-accent-secondary underline">press@stockgames.com</a></p>
          </div>
        </CardContent>
      </Card>
    </footer>
    </section>
  );
}
