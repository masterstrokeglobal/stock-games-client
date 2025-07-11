import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetUserGameHistory } from "@/react-query/game-user-queries";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

type History = {
  id: number;
  roundId: number;
  amount: number;
  winner: "7 Up" | "7 Down" | "7";
  selectedSide: "up" | "down";
  isWinner: boolean;
  createdAt: string;
  netProfitLoss: number;
};

const BetHistoryTable = ({ className }: { className?: string }) => {
  const [page, setPage] = useState(1);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterTime, setFilterTime] = useState<string>("");

  // For API: combine date and time if both are set
  const filterStartDate = filterDate && filterTime
    ? dayjs(`${filterDate} ${filterTime}`, "YYYY-MM-DD HH:mm").toISOString()
    : filterDate
      ? dayjs(filterDate).toISOString()
      : undefined;

  const { data: userGameHistory } = useGetUserGameHistory({
    page,
    roundRecordGameType: RoundRecordGameType.SEVEN_UP_DOWN,
    ...(filterStartDate ? { startDate: filterStartDate } : {}),
  });

  const { history, totalPages } = useMemo(() => {
    const history: History[] = userGameHistory?.data || [];
    const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
    return { history, totalPages };
  }, [userGameHistory]);

  // Pagination handlers
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Handlers for filter
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTime(e.target.value);
  };

  // Format for input values
  const formattedDate = filterDate
    ? dayjs(filterDate).format("YYYY-MM-DD")
    : "";
  const formattedTime = filterTime
    ? filterTime
    : "";

  return (
    <section className={cn("w-full overflow-hidden", className)}>
      <header className="py-4 px-4 flex flex-col gap-2 bg-transparent relative">
        <div className="flex items-center gap-2 justify-between w-full">
        <span className="text-[#8BB4FF] md:text-xl xs:text-lg font-bold tracking-wider uppercase">
          My Bet History
        </span>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-1 rounded-lg bg-[#2859B0] border border-[#8BB4FF] text-[#FFFFFF] text-sm font-semibold hover:bg-[#295CB5] transition-all"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            Filters
            <svg className={cn(!showFilter ? "rotate-180" : "")} width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.187169 8.33529C0.361869 8.51412 0.536569 8.69295 0.711268 8.87178C0.979564 8.66793 1.2464 8.46259 1.51179 8.25576C3.90025 6.39428 6.17079 4.41209 8.32341 2.30919C8.38143 2.25251 8.43936 2.19574 8.49721 2.13888L7.0654 2.10322C9.06201 4.24517 11.1758 6.27852 13.4069 8.20329C13.6616 8.42308 13.9179 8.64145 14.1757 8.8584C14.3591 8.68849 14.5425 8.51858 14.7259 8.34867C14.5292 8.07508 14.331 7.8029 14.1312 7.53215C12.382 5.16098 10.5156 2.89842 8.53195 0.744437C8.13872 0.31744 7.51658 0.304393 7.10013 0.708772C7.04194 0.765278 6.98383 0.821871 6.92581 0.878553C4.77319 2.98145 2.7385 5.20506 0.821726 7.54938C0.608751 7.80986 0.397233 8.07183 0.187169 8.33529Z" fill="white" />
            </svg>
          </button>
        </div>
        </div>
      {showFilter && (
        <div className="flex w-full gap-2 z-20">
            <input
              type="date"
              value={formattedDate}
              onChange={handleDateChange}
              className="text-white input-dark-calendar bg-[#111641B2] border border-[#6A9FFF] rounded h-8 px-2 outline-none  w-[120px] text-xs font-medium"
              style={{ appearance: "none" }}
              />
            <input
              type="time"
              value={formattedTime}
              onChange={handleTimeChange}
              className="text-white  input-dark-calendar h-8 px-2 rounded outline-none w-[100px] text-xs font-medium bg-[#111641B2] border border-[#6A9FFF]"
              style={{ appearance: "none" }}
              />
        </div>
      )}
      </header>
      <div className="hidden md:block">
        <div className="min-w-[700px]">
          <div className="flex font-montserrat sticky top-0 text-[#BED5FF] font-normal bg-transparent">
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[120px]">
              DATE
            </div>
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[100px]">
              TIME
            </div>
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[140px]">
              SELECTED SIDE
            </div>
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[120px]">
              WINNER
            </div>
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[100px]">
              BET INR
            </div>
            <div className="py-3 px-4 font-normal tracking-wider flex-1 min-w-[120px]">
              CASHOUT INR
            </div>
          </div>
          <ScrollArea className={cn(showFilter ? "h-[calc(100svh-28rem)]" : "h-[calc(100svh-25rem)]")} scrollThumbClassName="bg-[#BED5FF]">
            {history.map((bet, index) => (
              <div
                key={index}
                className="flex bg-[#517ED466] rounded-full mb-2 items-center"
              >
                <div className="py-2 px-4 text-white text-sm flex-1 min-w-[120px]">
                  {dayjs(bet.createdAt).format("DD/MM/YYYY")}
                </div>
                <div className="py-2 px-4 text-white text-sm flex-1 min-w-[100px]">
                  {dayjs(bet.createdAt).format("HH:mm A")}
                </div>
                <div className="py-2 px-4 flex-1 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        backgroundColor:
                          bet.selectedSide === "up" ? "#6DCB4B" : "#E94B4B",
                      }}
                      className={cn("size-3 rounded-full")}
                    />
                    <span className="text-white text-sm">
                      {bet.selectedSide}
                    </span>
                  </div>
                </div>
                <div className="py-2 px-4 flex-1 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        backgroundColor:
                          bet.winner === "7 Up" ? "#6DCB4B" : "#E94B4B",
                      }}
                      className={cn("size-3 rounded-full")}
                    />
                    <span className="text-white text-sm">{bet.winner}</span>
                  </div>
                </div>
                <div className="py-2 px-4 text-white text-sm flex-1 min-w-[100px]">
                  ₹{bet.amount}
                </div>
                <div className="py-2 px-4 text-white text-sm flex-1 min-w-[120px]">
                  ₹{bet.netProfitLoss}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="block md:hidden">
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col font-montserrat gap-4">
            {history.map((bet, index) => (
              <div
                key={index}
                className="rounded-xl bg-[#1B2B4B] border overflow-hidden border-[#517ED4] shadow-md"
              >
                <div className="flex  items-center justify-between  px-4 py-1 bg-[#1A2867] border-b border-[#517ED4] ">
                  <div className="text-[#8BB4FF] font-semibold text-base tracking-wider">
                    {dayjs(bet.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div className="text-[#BED5FF] font-semibold text-sm">
                    {dayjs(bet.createdAt).format("dddd")}
                  </div>
                </div>
                <div className=" gap-1 grid grid-cols-2 text-xs bg-[#2958AF] text-sm px-4 py-2 ">
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-[#BED5FF] whitespace-nowrap">
                      Selected Side :
                    </span>
                    <span
                      style={{
                        backgroundColor:
                          bet.selectedSide === "up" ? "#6DCB4B" : "#E94B4B",
                      }}
                      className={cn("size-3 rounded-full")}
                    />
                    <span className="text-white whitespace-nowrap">{bet.selectedSide === "up" ? "7 Up" : "7 Down"}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-[#BED5FF] whitespace-nowrap">
                      Winner :
                    </span>
                    <span
                      style={{
                        backgroundColor:
                          bet.winner === "7 Up" ? "#6DCB4B" : "#E94B4B",
                      }}
                      className={cn("size-3 rounded-full")}
                    />
                    <span className="text-white whitespace-nowrap">{bet.winner}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-[#BED5FF] whitespace-nowrap">
                      Bet INR :
                    </span>
                    <span className="text-white whitespace-nowrap">{bet.amount}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <span className="text-[#BED5FF] whitespace-nowrap">
                      Cashout INR :
                    </span>
                    <span className="text-white whitespace-nowrap">{bet.netProfitLoss}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-8 mt-6 select-none">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={cn(
              "flex items-center gap-1 text-base font-medium transition",
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:underline"
            )}
            style={{ color: "#fff" }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 18 18"
              className="inline-block"
            >
              <path
                d="M11.25 13.5L6.75 9L11.25 4.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>
          <span className="text-[#8BB4FF] text-base font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={cn(
              "flex items-center gap-1 text-base font-medium transition",
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline"
            )}
            style={{ color: "#fff" }}
          >
            Next
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 18 18"
              className="inline-block"
            >
              <path
                d="M6.75 4.5L11.25 9L6.75 13.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default BetHistoryTable;