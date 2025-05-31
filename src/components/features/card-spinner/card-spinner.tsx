// import { useLeaderboard } from '@/hooks/use-leadboard';
import styles from './card-spinner.module.css';
import { useLastRoundWinner } from '@/react-query/round-record-queries';
import { useGameType } from '@/hooks/use-game-type';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

export default function CardSpinner({ last10winners }: { last10winners: any[] }) {
  // const { stocks: leaderboardData } = useLeaderboard(roundRecord);
  // console.log('leaderboardData', leaderboardData);

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
      <div 
        className={`${styles.slider} ${styles.spinning}`}
        style={{ '--quantity': last10winners.length } as React.CSSProperties}
      >
        {rounds.map((round, index) => (
          <Card 
            key={index}
            number={round.roundNumber || -1}
            time={dayjs(round.startTime).format("hh:mm A")}
            color={(round.winningColor === "red"  ? 'red' : 'black')}
            name={round.winningMarket.name || `Card ${index + 1}`}
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
          <span className={styles.cardNumber}>{time}</span>
          <span className={styles.cardName}>{name}</span>
        </div>
      </div>
    </div>
  );
}