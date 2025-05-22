import { ColumnDef } from "@tanstack/react-table";
import CasinoGames, { GameStatus } from "@/models/casino-games";
import { useUpdateGame } from "@/react-query/casino-games-queries";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const casinoGamesColumns: ColumnDef<CasinoGames>[] = [
    {
        header: "Game Name",
        accessorKey: "gameName",
        cell: ({ row }) => {
            return <div className="w-48 truncate">{row.original.name}</div>
        }
    },
    {
        header: "Game Image",
        accessorKey: "gameImage",
        cell: ({ row }) => {
            return <img src={row.original.imageUrl} alt={row.original.name} className="w-10 h-10 rounded-md" />
        }
    },
    {
        header: "Game Type",
        accessorKey: "gameType",
        cell: ({ row }) => {
            return <Badge variant="outline"  className="w-fit truncate">{row.original.category.split("_").join(" ")}</Badge>
        }
    },

    {
        header: "Game Provider",
        accessorKey: "gameProvider",
        cell: ({ row }) => {
            return <div className="w-fit truncate uppercase font-semibold ">{row.original.subProviderName.split("_").join(" ")}</div>
        }
    },
    {
        header: "Game Status",
        accessorKey: "gameStatus",
        cell: ({ row }) => {
            return <Badge variant={row.original.status === GameStatus.ACTIVE ? "success" : "destructive"}>
                {row.original.statusLabel}
            </Badge>
        }
    },
    {
        header: "Hot Game",
        accessorKey: "popular",
        cell: ({ row }) => {
            return <PopularColumn row={row.original} />
        }
    },
    {
        header: "New Game",
        accessorKey: "new",
        cell: ({ row }) => {
            return <NewColumn row={row.original} />
        }
    },
    {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => {
            return <StatusColumn row={row.original} />
        }
    },

    {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
            return <div className="flex items-center gap-2">
                <Link href={`/dashboard/casino-games/${row.original.id}`}>
                    <Button variant="outline" size="icon">
                        <EditIcon />
                    </Button>
                </Link>
            </div>
        }
    }
]


export default casinoGamesColumns;

const StatusColumn = ({ row }: { row: CasinoGames }) => {

    const { mutate: updateGame } = useUpdateGame();

    return <div className="w-48 truncate">
        <Switch
            checked={row.status === GameStatus.ACTIVE}
            onCheckedChange={() => updateGame({ id: row.id, status: row.status === "active" ? GameStatus.IN_ACTIVE : GameStatus.ACTIVE })}
        />
    </div>
}

const PopularColumn = ({ row }: { row: CasinoGames }) => {
    const { mutate: updateGame } = useUpdateGame();
    return <Switch
        checked={row.popular}
        onCheckedChange={() => updateGame({ id: row.id, popular: !row.popular })}
    />
}

const NewColumn = ({ row }: { row: CasinoGames }) => {
    const { mutate: updateGame } = useUpdateGame();
    return <Switch
        checked={row.new}
        onCheckedChange={() => updateGame({ id: row.id, new: !row.new })}
    />
}
