"use client";
import AdvertismentDialog from "@/components/features/advertisement/advertismemnt-dialog";
// import CurrentBets from "@/components/features/game/current-bets";
// import LastWinners from "@/components/features/game/last-winners";
// import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RedBlackRouletteGame from "@/components/features/game/red-black-roulette-game";
// import { MobileGameHeader } from "@/components/features/game/roulette-header";
import UserWins from "@/components/features/game/user-wins-toggle";
// import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame } from "@/hooks/use-current-game";
// import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
// import { RoundRecord } from "@/models/round-record";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
// import { useTranslations } from "next-intl";
import CardSpinner from "@/components/features/card-spinner/card-spinner";
import PlaceBets from "@/components/features/game/place-bet";
import RedBlackLeaderBoard from "@/components/features/game/red-black-leaderboard";

declare global {
  interface Window {
    Tawk_API: any;
  }
}

const borderStyle = {
  borderColor: "var(--primary-game)",
  borderWidth: "1px",
  borderStyle: "solid",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
  zIndex: 10,
};

const last10winners = [
  { number: 1, color: "red", name: "NIFTY" },
  { number: 2, color: "black", name: "BANKNIFTY" },
  { number: 3, color: "red", name: "NIFTY" },
  { number: 4, color: "black", name: "BANKNIFTY" },
  { number: 5, color: "red", name: "NIFTY" },
  { number: 6, color: "black", name: "BANKNIFTY" },
  { number: 7, color: "red", name: "NIFTY" },
  { number: 8, color: "black", name: "BANKNIFTY" },
  { number: 9, color: "red", name: "NIFTY" },
  { number: 10, color: "black", name: "BANKNIFTY" },
];

const GamePage = () => {
  const { roundRecord } = useCurrentGame();
  //   const { isMobile } = useWindowSize();
  useHorseRaceSound(roundRecord);

  return (
    <>
      <section className={cn("pt-14 min-h-screen w-screen")}>
        <Navbar />
        <UserWins />
        <main className="grid grid-cols-12 gap-4 h-screen pt-8 px-4 pb-4 max-w-7xl mx-auto w-full">
          {/* Left Column: Top (e.g. RouletteGame) and Bottom (e.g. CardSpinner) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full">
            <div
              className="max-h-[300px] bg-las relative rounded-2xl overflow-hidden w-full"
              style={{
                flex: "0 0 50%", // 70% height
                ...borderStyle,
                backgroundImage: `url(/images/bg-lightning.jpg)`,
                backgroundSize: "100%",
              }}
            >
              {roundRecord && (
                <RedBlackRouletteGame roundRecord={roundRecord} />
              )}
            </div>
            <div
              className="rounded-2xl overflow-y-auto"
              style={{
                flex: "0 0 50%",
                ...borderStyle,
                backgroundImage: `url(/images/bg-design.jpg)`,
                backgroundSize: "10%",
              }}
            >
              {roundRecord && (
                <CardSpinner
                  last10winners={last10winners}
                  // roundRecord={roundRecord}
                />
              )}
            </div>
          </div>

          {/* Right Column: Top (PlaceBets) and Bottom (LeaderBoard) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 h-full w-full">
            <div
              className="rounded-2xl overflow-y-auto"
              style={{
                flex: "0 0 70%",
                ...borderStyle,
                backgroundImage: `url(/images/bg-design.jpg)`,
                backgroundSize: "10%",
              }}
            >
              {roundRecord && <PlaceBets roundRecord={roundRecord} />}
            </div>
            <div
              className="rounded-2xl overflow-y-auto"
              style={{
                flex: "0 0 30%",
                ...borderStyle,
                backgroundImage: `url(/images/bg-design.jpg)`,
                backgroundSize: "10%",
              }}
            >
              {roundRecord && <RedBlackLeaderBoard roundRecord={roundRecord} />}
            </div>
          </div>
        </main>
        <AdvertismentDialog />
        <TawkMessengerReact
          propertyId="/67fcabcc5de05719072dd2b9"
          widgetId="1iopfu6mp"
          onLoad={() => console.log("Tawk loaded")}
        />
        {/* {isMobile && roundRecord && <MobileGame roundRecord={roundRecord} />} */}
      </section>
    </>
  );
};

export default GamePage;

// const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
//   const gameState = useGameState(roundRecord);
//   return gameState.placeTimeLeft.formatted;
// };

// const MobileGame = ({ roundRecord }: { roundRecord: RoundRecord }) => {
//   const isPlaceOver = useIsPlaceOver(roundRecord);

//   return (
//     <section className="text-game-text">
//       <MobileHeader roundRecord={roundRecord} />
//       {!isPlaceOver && (
//         <main className="bg-[#0A1634]">
//           <div className="px-2">
//             <div
//               className="rounded-xl overflow-hidden min-h-[300px] max-h-[400px]"
//               style={{
//                 backgroundImage: `url(/images/bg-lightning.jpg)`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//                 zIndex: 1000,
//               }}
//             >
//               {roundRecord && (
//                 <RedBlackRouletteGame roundRecord={roundRecord} />
//               )}
//             </div>
//             {roundRecord && <CardSpinner last10winners={last10winners} />}
//             {/* {roundRecord && <CurrentBets round={roundRecord} />} */}
//           </div>
//         </main>
//       )}
//       {isPlaceOver && (
//         <>
//           {roundRecord && <RedBlackLeaderBoard roundRecord={roundRecord} />}
//           <div
//             className="rounded-xl overflow-hidden min-h-[300px] max-h-[400px] mx-2 mt-2"
//             style={{
//               backgroundImage: `url(/images/bg-lightning.jpg)`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               zIndex: 1000,
//             }}
//           >
//             <RedBlackRouletteGame roundRecord={roundRecord} />
//           </div>
//           {roundRecord && <CardSpinner last10winners={last10winners} />}
//         </>
//       )}
//     </section>
//   );
// };

// const MobileHeader = ({ roundRecord }: { roundRecord: RoundRecord }) => {
//   const isPlaceOver = useIsPlaceOver(roundRecord);
//   const t = useTranslations("game");

//   if (isPlaceOver) {
//     return (
//       <>
//         <MobileGameHeader roundRecord={roundRecord} />
//         {roundRecord && (
//           <div className="mx-2 mt-2 rounded-xl overflow-hidden">
//             <CardSpinner
//               // roundRecord={roundRecord}
//               last10winners={last10winners}
//             />
//           </div>
//         )}
//         <div className="mx-2 mt-2 rounded-xl overflow-hidden">
//           <HorseRace roundRecord={roundRecord} />
//         </div>
//       </>
//     );
//   }

//   return (
//     <header className="bg-background-game mx-2 flex justify-center flex-col text-center min-h-[20vh] rounded-xl">
//       {roundRecord && (
//         <div className="rounded-xl overflow-hidden">
//           <CardSpinner
//             // roundRecord={roundRecord}
//             last10winners={last10winners}
//           />
//         </div>
//       )}
//       <h1 className="mt-2">{t("round-starts-in")}</h1>
//       <p className="jersey text-6xl md:text-8xl leading-[3rem] md:leading-[5rem]">
//         <TimeLeft roundRecord={roundRecord!} />
//       </p>
//     </header>
//   );
// };
