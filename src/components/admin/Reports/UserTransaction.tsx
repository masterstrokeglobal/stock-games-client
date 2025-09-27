import React from "react";
import dayjs from "dayjs";

const UserTransaction = ({ data }: { data: any[] }) => {
  const getDisplayType = (type?: string) => {
    if (!type) return "N/A";
    if (type === "withdrawal") return "Internal Withdrawal";
    if (type === "deposit") return "Internal Deposit";
    if (type === ("operator_deposit" as any)) return "Operator Transfer";
    return type.split("_").join(" ");
  };

  return (
    <div id="userTransactionReport" className="p-4 space-y-4 w-[790px] h-[1123px]">
      <div className="flex justify-center items-center text-lg font-semibold">
        User Transactions Report
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium border-b pb-2">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Transaction ID</div>
          <div className="col-span-2">User</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">From</div>
          <div className="col-span-1">To</div>
          <div className="col-span-1">Bonus %</div>
          <div className="col-span-1">Created On</div>
        </div>

        <div className="flex flex-col gap-2">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item: any) => {
              const depositor = item?.depositorOperatorWallet?.operator;
              const creditor = item?.creditorOperatorWallet?.operator;
              const isPoints = item?.type === "points_earned" || item?.type === "points_redeemed";
              const formattedAmount = isPoints
                ? `${item?.amount ?? 0} Points`
                : `₹${Math.abs(Number(item?.amount ?? 0)).toFixed(2)}`;

              return (
                <div key={item?.id} className="grid grid-cols-12 gap-2 text-[9px] border-b pb-2">
                  <div className="col-span-1 ">{item?.id ?? "-"}</div>
                  <div className="col-span-2 ">{item?.pgId || "N/A"}</div>
                  <div className="col-span-2">{item?.user?.username || "N/A"}</div>
                  <div className="col-span-1">{getDisplayType(item?.type)}</div>
                  <div className="col-span-1">{formattedAmount}</div>
                  <div className="col-span-1 ">{String(item?.status || "N/A").split("_").join(" ")}</div>
                  <div className="col-span-1">
                    {depositor?.name ? (
                      <>
                        <div>{depositor?.name}</div>
                        <div className="text-[10px] opacity-70">{depositor?.email}</div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="col-span-1">
                    {creditor?.name ? (
                      <>
                        <div>{creditor?.name}</div>
                        <div className="text-[10px] opacity-70">{creditor?.email}</div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="col-span-1">{item?.bonusPercentage ? `${item.bonusPercentage}%` : "N/A"}</div>
                  <div className="col-span-1">
                    <div>{item?.createdAt ? dayjs(item.createdAt).format("DD-MM-YYYY") : "-"}</div>
                    <div className="text-[10px] opacity-70">{item?.createdAt ? dayjs(item.createdAt).format("HH:mm:ss") : "-"}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-sm opacity-70">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTransaction;
