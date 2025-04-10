import { useAuthStore } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import User from '@/models/user';
import Wallet from '@/models/wallet';
import { useGetWallet } from '@/react-query/payment-queries';
import { Star } from 'lucide-react';
import { useMemo, useState } from 'react';


const UserProfileCard = ({ className }: PropsWithClassName) => {
  const [progress] = useState(50);

  const { userDetails } = useAuthStore();

  const user = userDetails as User || { username: 'Test', email: 'test123@gmail.com' };

  const { data, isLoading } = useGetWallet();

  const wallet = useMemo(() => {
    if (isLoading) return null;
    return new Wallet(data?.data?.wallet);
  }, [data]);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="relative  overflow-hidden bg-gradient-to-br from-blue-800 to-blue-950 rounded-xl w-full  border border-white/20">
        {/* Content container */}
        <div className="relative z-10 flex space-y-4 p-4">
          {/* Top row with user info and member status */}
          <div className='flex-1'>

          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">{user.username || 'Test'}</h2>
              <p className="text-xs text-blue-200">{user.email || 'test123@gmail.com'}</p>
            </div>
          </div>

          {/* Coin badge */}
          <div className="mt-2 flex-1">
            {/*silver*/}
          
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-3 py-1 rounded-full font-bold">
              <img src="/coin.svg" alt="coin" className="md:w-auto w-5" />
              <span className="text-base">{wallet?.totalBalance}</span>
            </div>
          </div>

          </div>
          {/* Bottom section with circle progress and next tier */}
          <div className="flex justify-between flex-1 flex-col items-center mt-6 space">
            {/* Empty space to balance layout */}
            <div className="flex-1">
            <div className='flex items-center gap-2'>
              <Star className='w-5 h-5 fill-[#c0c0c0] stroke-[#c0c0c0]' />
              <span className='text-xs text-gray-300'>Silver Member</span>
            </div>
            </div>

            {/* Progress circle */}
            <div className="relative size-32">
              {/* Progress circle with SVG */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ffd700"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>

              {/* Percentage text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">50%</span>
                <span className="text-xs text-blue-200">Completed</span>
              </div>
            </div>

            {/* Next tier info */}
            <div className="flex-1 text-center">
              <p className="text-white text-sm">Next Tier: <Star className="inline w-4 h-4 fill-yellow-400 stroke-yellow-500" /> Gold</p>
              <p className="text-xs text-gray-300 mt-1">Play 10 more games to upgrade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;