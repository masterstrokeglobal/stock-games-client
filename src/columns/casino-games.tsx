import { ColumnDef } from "@tanstack/react-table";
import CasinoGames, { GameStatus } from "@/models/casino-games";
import { useUpdateGame } from "@/react-query/casino-games-queries";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
            return <div className="w-48 truncate">{row.original.category}</div>
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
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
            return <StatusColumn row={row.original} />
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
