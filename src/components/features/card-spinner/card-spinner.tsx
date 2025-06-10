import { useGameType } from '@/hooks/use-game-type';
import { useLastRoundWinner } from '@/react-query/round-record-queries';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import styles from './card-spinner.module.css';

export default function Last10WinnersCardSpinner() {
  const [gameType] = useGameType();
  const { data, isSuccess, refetch } = useLastRoundWinner(gameType);

  const rounds: any[] = useMemo(() => {
    if (isSuccess) {
      return Array.from(data.data);
    }
    return [];
  }, [isSuccess, data]);

  useEffect(() => {
    const FIFTEEN_SECONDS = 1000 * 15 * 1;
    const interval = setInterval(() => {
      if (isSuccess) {
        refetch();
      }
    }, FIFTEEN_SECONDS);
    return () => clearInterval(interval);
  }, [isSuccess, data]);

  // console.log("Ronds" , rounds)

  return (
    <div className={styles.banner}>
      <img src="/images/four-group/fight2.gif" alt="card-spinner" className='w-full h-full object-contain relative z-10' />
      <div
        className={`${styles.slider} ${styles.spinning}`}
        style={{ '--quantity': rounds.length } as React.CSSProperties}
      >
        {rounds.map((round, index) => (
          <Card
            key={index}
            number={round.roundNumber || -1}
            time={dayjs(round.startTime).format("hh:mm A")}
            color={(round.winningColor === "red" ? 'red' : 'black')}
            name={round?.winningMarket?.name || `Card ${index + 1}`}
            position={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  number,
  color,
  name,
  position,
  time,
}: {
  number: any;
  time: any;
  color: string;
  name: string;
  position: number;
}) {
  return (
    <div
      className={styles.item}
      style={{ '--position': position } as React.CSSProperties}
    >
      <div className={`${styles.card} ${styles[color.toLowerCase()]}`}>
        <div className={styles.cardContent}>
          <span className={styles.cardNumber}>Round {number}</span>
          <span className={styles.cardTime}>{time}</span>
          <span className={styles.cardName}>{name}</span>
        </div>
      </div>
    </div>
  );
}