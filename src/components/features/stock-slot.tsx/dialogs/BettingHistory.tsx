import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetUserGameHistory } from "@/react-query/game-user-queries";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg bg-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors font-wendy-one"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-[#FFFFFFB2] px-4 py-2 font-wendy-one text-xs lg:text-base">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg bg-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors font-wendy-one"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

type History = {
  id: number;
  roundId: number;
  amount: number;
  isWinner: boolean;
  createdAt: string;
  netProfitLoss: number;
};

const BettingHistory = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data: userGameHistory, refetch } = useGetUserGameHistory({
    page,
    roundRecordGameType: RoundRecordGameType.STOCK_SLOTS,
  });

  const { history, totalPages } = useMemo(() => {
    const history: History[] = userGameHistory?.data || [];
    const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
    return { history, totalPages };
  }, [userGameHistory]);

  useEffect(() => {
    console.log("loki history", history);
  }, [history]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        className="[&>button]:text-white [&>button]:focus:ring-0 bg-transparent border-none w-full max-w-xl md:max-w-2xl lg:max-w-3xl "
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full md:max-h-[70vh] relative flex flex-col items-center justify-center p-[10%] pt-[15%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src="/images/slot-machine/happy-bull.png"
            alt=""
            className="absolute w-[100px] lg:w-[150px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1 relative w-full flex justify-center items-center">
            <DialogTitle className="text-[15px] lg:text-[30px] xl:text-[40px]">
              Betting History
            </DialogTitle>
            <button
              onClick={handleRefresh}
              className="absolute right-0 p-2 text-white transition-colors font-wendy-one"
              title="Refresh History"
            >
              <RefreshCw size={16} className="lg:w-5 lg:h-5" />
            </button>
          </DialogHeader>
          <DialogDescription className="text-center flex flex-col gap-1 p-5 pt-0 overflow-y-auto max-h-[40vh] min-h-[200px] text-xs lg:text-2xl w-full">
            <div className="grid grid-cols-5 gap-1 py-2">
              <p>Round</p>
              <p>Amount</p>
              <p>Date</p>
              <p>Status</p>
              <p>P&L</p>
            </div>
            <div className="flex flex-col gap-1">
              {history.length === 0 ? (
                <div className="py-4 text-center">No betting history found</div>
              ) : (
                history.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-1 py-2">
                    <p>#{row.roundId}</p>
                    <p>₹{row.amount}</p>
                    <p>{dayjs(row.createdAt).format("DD/MM")}</p>
                    <p
                      className={
                        row.isWinner ? "text-green-400" : "text-red-400"
                      }
                    >
                      {row.isWinner ? "Win" : "Loss"}
                    </p>
                    <p
                      className={
                        row.netProfitLoss > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {row.netProfitLoss > 0
                        ? `+₹${row.netProfitLoss}`
                        : `₹${row.netProfitLoss}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DialogDescription>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingHistory;
