import React, { useEffect, useState } from "react";
import { RoundRecord } from "@/models/round-record";
import { useGameState } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";

const GameEndDialog = ({
  multiplier,
  planeStatus,
  betAmount = 0,
  hasBet = false,
  hasCashedOut = false,
  setIsDialogVisible,
  isDialogVisible,
  roundRecord,
}: {
  multiplier: number;
  planeStatus?: "active" | "crashed" | "flew_away";
  betAmount?: number;
  hasBet?: boolean;
  hasCashedOut?: boolean;
  roundRecord: RoundRecord;
  setIsDialogVisible: (isVisible: boolean) => void;
  isDialogVisible: boolean;
}) => {
  const { gameTimeLeft, isPlaceOver } = useGameState(roundRecord);
  const [showPlane, setShowPlane] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const {isMobile} = useWindowSize()

  const handleCloseDialog = () => {
    setShowDialog(false);
    setShowPlane(true);
    setIsDialogVisible(false);
  };

  //? show dialog when user has bet
  useEffect(() => {
    if (hasBet) {
      setIsDialogVisible(true);
    }
  }, [hasBet]);

  //? show dialog pnly when user has bet after 2 seconds when plane crashes or flew away
  useEffect(() => {
    if (showPlane) {
      setTimeout(() => {
        if (hasBet) {
          setShowPlane(false);
          setShowDialog(true);
        }
      }, 2000);
    }
  }, [showPlane]);

  //? show dialog when user cashed out
  useEffect(() => {
    if (hasCashedOut) {
      setShowDialog(true);
    }
  }, [hasCashedOut]);

  //? show plane when plane crashes or flew away
  useEffect(() => {
    if (planeStatus === "crashed" || planeStatus === "flew_away") {
      setShowPlane(true);
    }
  }, [planeStatus]);

  //? hide dialog when placement is not over
  if (!isPlaceOver) {
    return null;
  }

  if (showPlane) {
  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-full flex-col gap-1 z-20 top-[75px] lg:top-0">
      <div className="flex flex-col items-center justify-center gap-1 absolute lg:font-righteous font-quantico top-0 lg:top-1/2 lg:-translate-y-1/2">
        <h1 className="2xl:text-[50px] lg:text-[30px] text-[15px] lg:font-bold">
          {planeStatus === "crashed"
            ? "Plane Crashed"
            : planeStatus === "flew_away"
            ? "Flew Away"
            : ""}
        </h1>
        <img
          src={
            planeStatus === "crashed"
              ? "/images/aviator/planes/crashed-plane.png"
              : planeStatus === "flew_away"
              ? "/images/aviator/planes/plane-flew.png"
              : ""
          }
          className={`2xl:w-[540px] lg:w-[400px] ${planeStatus === "crashed" ? "w-[270px]" : "w-[200px]"}`}
        />
      </div>
    </div>
  );
  }

  if (showDialog && isDialogVisible) {
  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-screen flex-col gap-1 z-20">
      <div className="flex flex-col items-center justify-center gap-1 absolute p-2 -translate-y-1/3 lg:translate-y-0">
        <img
          src={`/images/aviator/dialogs/${isMobile ? "desktop-bg.png" : "desktop-bg.svg"}`}
          className="absolute z-10 max-w-[330px] lg:max-w-[380px] xl:max-w-[420px]"
        />
        <img
          src={`/images/aviator/dialogs/${isMobile ? "desktop-ext.svg" : "desktop-ext.svg"}`}
          className="h-[100px] absolute -translate-y-[160px] lg:-translate-y-[190px] translate-x-[60px] z-10"
        />
        {planeStatus === "crashed" && (
          <img
            src="/images/aviator/planes/crashed-plane.png"
            alt="plane-crash"
            className="absolute z-10 opacity-[0.25] xl:h-[322px] lg:h-[280px] h-[263px]"
          />
        )}
        {planeStatus === "flew_away" && (
          <img
            src="/images/aviator/planes/plane-flew.png"
            alt="plane-flew"
            className="absolute z-10 opacity-[0.25] h-[250px] xl:h-[300px] rotate-[17deg]"
          />
        )}

        <div className="max-w-[330px] lg:max-w-[380px] xl:max-w-[420px] flex flex-col items-center justify-center z-20 gap-4 font-quantico p-5 translate-y-[10px]">
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold">Race Completed</div>
            {/* {planeStatus === "crashed" && !hasCashedOut && ( */}
              <div className="xl:text-[18px] lg:text-base text-[14px] font-bold text-[#F1443E]">
                You lost : INR {betAmount}
              </div>
            {/* )} */}
            {hasCashedOut && (
              <div className="xl:text-[18px] lg:text-base text-base font-bold text-[#65F13E]">
                You won : INR {betAmount * multiplier}
              </div>
            )}
            {planeStatus === "flew_away" && !hasCashedOut && (
              <div className="xl:text-[18px] lg:text-base text-base font-bold text-[#65F13E]">
                You won : INR {betAmount * multiplier}
              </div>
            )}
            {/* {hasBet && ( */}
              <div className="xl:text-[14px] lg:text-xs text-[10px]">
                Placed Bet : INR {betAmount}
              </div>
            {/* )} */}
            {hasCashedOut && <div>Cashout at : {multiplier}x</div>}
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex flex-col items-center justify-center ">
              <div className="text-[10px] lg:text-xs xl:text-base">
                Final Multiplier : {multiplier}x
              </div>
              <div className="text-xs lg:text-xs xl:text-base">
                Next Round in {gameTimeLeft?.shortFormat}
              </div>
            </div>
            <button
              className="z-40"
              onClick={() => {
                handleCloseDialog();
              }}
            >
              <img
                className="w-[100px] lg:w-[120px] xl:w-[140px]"
                src="/images/aviator/dialogs/try-btn.svg"
                alt="desktop-btn"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  }
};

export default GameEndDialog;
