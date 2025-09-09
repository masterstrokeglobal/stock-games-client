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
import React, { useMemo, useState } from "react";
import Image from "next/image";

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
    <div className="flex items-center justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src="/images/slot-machine/prev-btn.png" width={70} height={70} alt="prev" />
      </button>
      <span
        style={{ textShadow: "0 0 7px #028DFF" }}
        className="text-[#00224E] px-4 py-2 font-wendy-one text-xs lg:text-base"
      >
        {currentPage}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src="/images/slot-machine/next-btn.png" width={70} height={70} alt="next" />
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
  const { data: userGameHistory} = useGetUserGameHistory({
    page,
    roundRecordGameType: RoundRecordGameType.STOCK_SLOTS,
  });

  const { history, totalPages } = useMemo(() => {
    const history: History[] = userGameHistory?.data || [];
    const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
    return { history, totalPages };
  }, [userGameHistory]);


  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="[&>button]:text-white [&>button]:focus:ring-0 bg-transparent border-none w-full max-w-xl md:max-w-2xl lg:max-w-3xl "
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full min-h-[400px] md:min-h-[500px] max-h-[60vh] relative flex flex-col px-[10%] py-8 font-wendy-one text-[#FFFFFFB2]"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 right-0"
          >
            <Image
              src="/images/slot-machine/cancel-btn.png"
              alt="cancel"
              width={40}
              height={40}
            />
          </button>
          <DialogHeader className="p-1 relative w-full flex justify-center items-center">
            <DialogTitle className="text-xl xl:text-3xl text-center uppercase slot-gradient-text font-blood-melt">
              Game History
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center flex flex-col gap-1 px-5 overflow-y-auto text-xs lg:text-2xl w-full font-blood-melt">
            <div className="grid md:grid-cols-5 grid-cols-3 gap-1 py-2">
              <p className="hidden md:block slot-gradient-text">Round</p>
              <p className="slot-gradient-text">Amount</p>
              <p className="slot-gradient-text">Date</p>
              <p className="hidden md:block slot-gradient-text">Status</p>
              <p className="slot-gradient-text">P&L</p>
            </div>
            <div className="flex flex-col gap-1">
              {history.length === 0 ? (
                <div className="py-4 text-center">No betting history found</div>
              ) : (
                history.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid md:grid-cols-5 grid-cols-3 gap-1 py-2"
                  >
                    <p className="hidden md:block slot-gradient-text">#{row.roundId}</p>
                    <p className="slot-gradient-text">₹{row.amount}</p>
                    <p className="slot-gradient-text">{dayjs(row.createdAt).format("DD/MM")}</p>
                    <p
                      className={`${
                        row.isWinner ? "slot-gradient-text" : "text-red-400"
                      } hidden md:block`}
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
