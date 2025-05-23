import { Bookmark } from "lucide-react";
import { useToggleToFavorites, useGetMyFavorites } from "@/react-query/favorite-market-item-queries";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";

interface FavoriteMarketItemProps {
    marketItemId: number;
    className?: string;
}

const FavoriteMarketItem = ({ marketItemId, className }: FavoriteMarketItemProps) => {
    const { mutate: toggleFavorite } = useToggleToFavorites();
    const { data: myFavorites } = useGetMyFavorites();
    
    const isFavorite = myFavorites?.includes(marketItemId);
    const handleToggleFavorite = () => {
        toggleFavorite(marketItemId);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="ghost"
                        size="icon"
                        className={cn("hover:bg-primary", className)}
                        onClick={handleToggleFavorite}
                    >
                        <Bookmark 
                            className={cn(
                                "w-5 h-5 transition-all duration-200 hover:scale-110",
                                isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                            )}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FavoriteMarketItem;