import GameResult from '@/components/common/game-result';
import { useStockGameRoundResult } from '@/react-query/slot-game-queries';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const SlotGameResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const { data, isLoading, isError } = useStockGameRoundResult(roundRecordId,open);
  return (
        <GameResult data={data}
          showDialog={open}
          isLoading={isLoading}
          isError={isError}
        />
   
  );
};

export default SlotGameResultDialog;
