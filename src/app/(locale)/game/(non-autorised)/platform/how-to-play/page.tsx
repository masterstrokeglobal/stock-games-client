"use client";

export default function GameGuideUI() {
  
  const guides = [
    {
      title: "Stock Derby Game Guide",
      description: "Learn how to play our Stock Derby game. Forecast price movements, manage your virtual portfolio, and beat the market! Discover strategies & tips to win big with our guide.",
      imageClass: "bg-blue-600 rounded-lg",
      image: "/images/stock-roulette.png"
    },
    {
      title: "Stock Jackpot Game Guide",
      description: "Learn how to play our Stock Jackpot game. Forecast price movements, manage your virtual portfolio, and beat the market! Discover strategies & tips to win big with our guide.",
      imageClass: "bg-blue-600 rounded-lg",
      image: "/images/stock-roulette.png"
    },
  ];

  return (
    <div className="min-h-screen w-full text-white">
      
      {/* Main content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">How to Guides</h1>
          <div className="flex gap-2">
            {/* Placeholder for decorative icons in top right */}
            <div className="w-32 h-16 bg-slate-800 rounded-md opacity-20"></div>
            <div className="w-16 h-16 bg-slate-800 rounded-md opacity-20"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <div key={index} className=" rounded-lg group   transition-colors cursor-pointer">
              {/* Empty placeholder for game images */}
              <img src={guide.image} className={`h-auto group-hover:-translate-y-2 transition-all duration-300 aspect-square w-full ${guide.imageClass}`}></img>
              <div className="py-4">
                <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
                <p className="text-gray-300 text-sm">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}