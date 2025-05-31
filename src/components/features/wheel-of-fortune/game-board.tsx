import { cn, INR } from '@/lib/utils';
import { RoundRecord, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { useCreateWheelOfFortunePlacement, useGetMyCurrentRoundWheelOfFortunePlacement } from '@/react-query/wheel-of-fortune-queries';

// Color configuration mapping

type Props = {
  roundRecord: RoundRecord;
  amount: number;
  className?: string;
  children?: React.ReactNode;
  winningColor?: WheelColor;
}

export default function WheelOfFortuneGameBoard({ className, children }: Props) {

  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative", className)}>
      {children}
    </div>
  );
}