import GameResult from '@/components/common/game-result';
import { useGetDiceGameRoundResult } from '@/react-query/dice-game-queries';
import { useEffect, useState } from 'react';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const DiceGameResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
    const { data, isLoading, isError } = useGetDiceGameRoundResult(roundRecordId, open);

  useEffect(() => {
    if (open) {
      setShowDialog(open);
    }
  }, [open]);

  return (
    <GameResult showDialog={showDialog} setShowDialog={setShowDialog} isLoading={isLoading} isError={isError} data={data} />
  );
};

export default DiceGameResultDialog;