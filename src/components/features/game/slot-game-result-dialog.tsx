import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn, formatRupee } from '@/lib/utils';
import { AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useStockGameRoundResult } from '@/react-query/slot-game-queries';
import GameResult from '@/components/common/game-result';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const SlotGameResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data, isLoading, isError } = useStockGameRoundResult(roundRecordId);

  useEffect(() => {
    if (open) {
      setShowDialog(open);
    }
  }, [open]);

  // Check if the result is a win or loss
  const isWin = data && Number(data.netProfitLoss) >= 0;

  return (
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-md bg-primary-game text-white [&>.close-button]:hidden" data-hide-children="true">
        <DialogHeader>
          <DialogTitle>Round Results</DialogTitle>
        </DialogHeader>

        <GameResult data={data?.data}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          isLoading={isLoading}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SlotGameResultDialog;
