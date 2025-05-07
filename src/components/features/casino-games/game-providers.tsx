import React from "react";

const providers = [
  { alt: "EVOLUTION", src: "https://www.pinkybet.co/static/media/evolution_img.456aa2bf.svg" },
  { alt: "EZUGI", src: "https://www.pinkybet.co/static/media/ezugi_img.fbd64fa7.svg" },
  { alt: "SPRIBE", src: "https://www.pinkybet.co/static/media/spribe_img.442b2a12.svg" },
  { alt: "SMARTSOFT GAMING", src: "https://www.pinkybet.co/static/media/smartsoft_img.e13d7f85.svg" },
  { alt: "PLAYTECH", src: "https://www.pinkybet.co/static/media/playtech_img.371b4597.svg" },
  { alt: "BetGames_TV", src: "https://www.pinkybet.co/static/media/betgames_img.03eabe21.svg" },
  { alt: "Evoplay", src: "https://www.pinkybet.co/static/media/evoplay_img.60dec60c.svg" },
  { alt: "TURBO", src: "https://www.pinkybet.co/static/media/turbo_img.de10d05e.svg" },
  { alt: "GAMZIX", src: "https://www.pinkybet.co/static/media/gamezix_img.b750d7dd.svg" },
  { alt: "JILI", src: "https://www.pinkybet.co/static/media/jili_img.da065a68.svg" },
  { alt: "VIVO", src: "https://www.pinkybet.co/static/media/vivo_img.a6560fa2.svg" },
  { alt: "AE Sexy", src: "https://www.pinkybet.co/static/media/AE%20SEXY.29690a7e.svg" }, // Note: encoded space
];

const CasinoProviders = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Game Providers</h2>
      <div className="casino-provider-ctn grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 ">
        {providers.map((provider, index) => (
          <img
            key={index}
              className="home-casino-img object-contain"
              src={provider.src}
              alt={provider.alt}
              loading="lazy"
            />
      ))}
    </div>
    </section>
  );
};

export default CasinoProviders;
