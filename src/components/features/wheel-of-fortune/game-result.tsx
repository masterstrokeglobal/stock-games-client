import GameResult from '@/components/common/game-result';
import { useGetWheelOfFortuneRoundResult } from '@/react-query/wheel-of-fortune-queries';
import { useEffect, useState } from 'react';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const WheelOfFortuneResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data, isLoading, isError } = useGetWheelOfFortuneRoundResult(roundRecordId, open);

  useEffect(() => {
    if (open) {
      setShowDialog(open);
    }
  }, [open]);

  return (
    <GameResult showDialog={showDialog} setShowDialog={setShowDialog} isLoading={isLoading} isError={isError} data={data} />
  );
};

export default WheelOfFortuneResultDialog;