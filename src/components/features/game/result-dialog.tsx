import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetMyRoundResult } from '@/react-query/round-record-queries';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const GameResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const { data, isLoading, isError } = useGetMyRoundResult(roundRecordId,open);

  return (
    <Dialog key={String(open)} defaultOpen={open}>
      <DialogContent className="sm:max-w-md bg-primary-game text-white">
        <DialogHeader>
          <DialogTitle>Round Results</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading results...</p>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load round results. Please try again.
              </AlertDescription>
            </Alert>
          ) : data ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Amount Win</p>
                <p className="text-2xl font-bold">${data.data.amountWin.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Original Bet</p>
                <p className="text-2xl font-bold">${data.data.originalBet.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Multiplier</p>
                <p className="text-2xl font-bold">{data.data.multiplier}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No results available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameResultDialog;
