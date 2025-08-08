import { useGameType } from "@/hooks/use-game-type";
import { useAviatorRoundHistory } from "@/react-query/aviator-queries";
import dayjs from "dayjs";
import HowToDialog from "./dialogs/how-to-dialog";
import BettingHistoryDialog from "./dialogs/betting-history-dialog";
import ContactDialog from "../platform/contact-dialog";

const exampleUsers = [
  { name: "User", bet: 100 },
  { name: "User2", bet: 200 },
  { name: "User3", bet: 300 },
];

export default function LastRoundsPanel() {
  const [gameType] = useGameType();
  const { data: lastRounds } = useAviatorRoundHistory(gameType);

  const getMultiplierColor = (multiplier: string) => {
    const value = Number.parseFloat(multiplier.replace("x", ""));
    if (value >= 10) return "text-purple-400";
    if (value >= 5) return "text-green-400";
    if (value >= 2) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex flex-shrink-0 max-w-[320px] xl:max-w-[420px] flex-1 h-full z-50">
      <div className="w-full h-full flex flex-col">
        <div className="flex-none space-y-6 text-[#FFFFFF80] h-full overflow-hidden" >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-1 font-poppins flex-shrink-0">
            <BettingHistoryDialog />
            <HowToDialog />
            <ContactDialog>
              <button className="p-[10px] bg-[#99B2FF33] rounded-full flex-shrink-0 w-fit xl:text-base text-sm">
                Support
              </button>
            </ContactDialog>
          </div>

          {/* user table  */}
          <div className="flex flex-col gap-2 text-sm xl:text-base flex-shrink-0">
            <div className="user-table-header flex items-center gap-2 w-full ">
              <div className="w-full font-poppins">User</div>
              <div className="w-[100px] flex flex-shrink-0 items-center gap-2">
                Bet
              </div>
            </div>

            <div className="user-list flex flex-col gap-2 w-full">
              {exampleUsers.map((user, index) => (
                <div
                  key={index}
                  className="user-list-item flex items-center gap-2 w-full rounded-full bg-[#FF8AE633] p-2 text-sm xl:text-base"
                >
                  <div className="w-full flex items-center gap-2">
                    <img
                      src="/images/aviator/objects/male-avatar.png"
                      alt="avatar"
                      className="w-5 h-5 xl:w-7 xl:h-7"
                    />
                    <span className="font-poppins">{user.name}</span>
                  </div>
                  <div className="w-[100px] flex flex-shrink-0 items-center gap-2">
                    <img
                      src="/images/aviator/objects/coin.png"
                      alt="avatar"
                      className="w-5 h-5"
                    />
                    <span className="font-quantico">{user.bet}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* results Table */}
          <div className="w-full min-w-[320px] flex flex-col gap-4 text-sm xl:text-base flex-1">
            <h1 className="uppercase text-center font-quantico">
              Race results
            </h1>
            <div className="w-full flex flex-col gap-2 h-[50vh]">
              <div className="flex items-center gap-2 w-full px-2">
                <div className="grid grid-cols-4 font-poppins uppercase w-full border border-transparent">
                  <div className="pb-2 text-left">Time</div>
                  <div className="pb-2 text-center">Name</div>
                  <div className="pb-2 text-center">Multiplier</div>
                  <div className="pb-2 text-right">Status</div>
                </div>
              </div>
              <div className="space-y-2 w-full overflow-y-auto flex-1 ">
                {lastRounds?.map((round, index) => (
                  <div
                    key={`${round.roundId}-${round.code}-${index}`}
                    className={`grid grid-cols-4 ${
                      round.status === "crashed"
                        ? "bg-[#99B2FF33]"
                        : "bg-[#15FF0033]"
                    } rounded-full border border-[#FFFFFF1F] px-2`}
                  >
                    <div className="py-2">
                      <span className="whitespace-nowrap">
                        {dayjs(round.time).format("hh:mm")}
                      </span>
                    </div>
                    <div
                      className="py-2 text-center cursor-pointer"
                      title={round.name}
                    >
                      <span className=" whitespace-nowrap block truncate">
                        {round.name}
                      </span>
                    </div>
                    <div className="py-2 text-center font-quantico">
                      <span
                        className={` ${getMultiplierColor(
                          round?.multiplier?.toString() ?? "1"
                        )}`}
                      >
                        {round?.multiplier}
                      </span>
                    </div>
                    <div className="py-2 flex justify-end items-center pe-4">
                      <img
                        src={`/images/aviator/planes/plane-${
                          round.status === "crashed" ? "crashed" : "flew-away"
                        }.png`}
                        alt="crashed"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
