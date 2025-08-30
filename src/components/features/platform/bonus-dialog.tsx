"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CircleX, Trophy } from "lucide-react";
import { ReactNode } from "react";
import BonusSummaryComponent from "@/components/features/bonus/bonus-summary";

interface BonusDialogProps {
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

const BonusDialog = ({ children, open, onClose }: BonusDialogProps) => {
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) onClose?.();
  };
  return (
    <Dialog defaultOpen={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showButton={false} className="sm:max-w-2xl dark:bg-[#121456] bg-primary-game rounded-2xl border-2 dark:border-platform-border border-primary-game gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 rounded-t-2xl">
          <DialogTitle className="text-white text-lg font-semibold text-center flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> My Bonuses
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute bg-transparent right-4 top-2 mt-0">
              <CircleX className="text-white" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-150px)] bg-primary-game rounded-t-3xl border-t-2 border-platform-border" scrollThumbClassName="bg-platform-border">
          <div className="flex flex-col items-stretch dark:bg-[#050128] bg-[#C3E3FF] rounded-t-3xl rounded-b px-4 py-6 gap-6">
            <BonusSummaryComponent showHeader={false} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BonusDialog;
