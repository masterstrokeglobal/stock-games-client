import GameResult from '@/components/common/game-result';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useStockGameRoundResult } from '@/react-query/slot-game-queries';
import { useEffect, useState } from 'react';

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
