import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import { Star } from "lucide-react";
import { useMemo } from "react";

const UserProfile = ({ className }: PropsWithClassName) => {
  const { userDetails } = useAuthStore();
  const { data, isLoading } = useGetWallet();
  
  const wallet = useMemo(() => {
    if (isLoading) return new Wallet();
    return new Wallet(data?.data?.wallet);
  }, [data]);
  
  const user = userDetails as User;
  
  // Inline styles for the circular gradient

  return (
    <section
      className={cn(
        "relative overflow-hidden mt-20 bg-primary-game border  bg-gradient-to-br from-blue-800 to-blue-950  border-white/20  bg-blue-950 mb-6 w-full max-w-md mx-auto ",
        "rounded-xl p-4 sm:p-6",
        className
      )}
    >
      {/* Main background with deep blue gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-blue-900 to-blue-950"></div>
      
      {/* Stitched border effect */}
      <div className="absolute inset-0 -z-10 rounded-xl border-2 border-white/20 m-1">
        <div className="absolute inset-0 border-2 border-dashed border-white/30"></div>
      </div>
      
      
      {/* Inner shadow for depth */}
      <div className="absolute inset-0 shadow-inner shadow-black/30 -z-10"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-1 text-white">{user?.username}</h2>
          <p className="text-xs md:text-sm text-blue-200">{user?.email}</p>
        </div>
        <Badge className="bg-gradient-to-r text-base md:text-xl from-amber-500 to-amber-300 text-black px-2 sm:px-3 py-1 flex items-center">
          <img src="/coin.svg" alt="coin" className="size-5 md:size-7 mr-1 md:mr-2" />
          {wallet?.totalBalance}
        </Badge>
      </div>
      
       {/* Custom style for radial gradient since Tailwind doesn't have built-in radial gradients */}
       <style jsx>{`
          .radial-gradient {
            background: radial-gradient(circle at center, #1e40af 0%, #172554 100%);
            width: 100%;
            height: 100%;
          }
        `}</style>
      <div className="flex mt-3 md:mt-4 space-x-1">
        <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-500 stroke-yellow-600" /> 
        <p className="ml-2">
          <span className="font-bold">Gold Member</span> 
        </p>
      </div>
    </section>
  );
};

export default UserProfile;