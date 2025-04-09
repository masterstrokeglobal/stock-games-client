"use client";
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import FormInput from '@/components/ui/form/form-input';
import FormProvider from '@/components/ui/form/form-provider';
import FormGroupSelect from '@/components/ui/form/form-select';
import FormSwitch from '@/components/ui/form/form-switch';
import { Separator } from "@/components/ui/separator";
import useNSEAvailable from '@/hooks/use-nse-available';
import { LOBBY_GAMES } from '@/lib/constants';
import { LobbyGameType, LobbyType } from '@/models/lobby';
import { SchedulerType } from '@/models/market-item';
import { useCreateLobby } from '@/react-query/lobby-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";

export enum LobbyStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed",
}


export enum LobbyUserStatus {
    JOINED = "joined",
    PLAYING = "playing",
    LEFT = "left",
}


const createLobbySchema = z.object({
    name: z.string().min(3, { message: "Lobby name must be at least 3 characters" }),
    gameType: z.nativeEnum(LobbyGameType, {
        required_error: "Please select a game type"
    }),
    marketType: z.nativeEnum(SchedulerType, {
        required_error: "Please select a market type"
    }),
    roundTime: z.coerce.number(),
    maxCapacity: z.coerce.number()
        .min(2, { message: "Minimum 2 players required" })
        .max(50, { message: "Maximum 50 players allowed" }),
    // should be multiple of 100
    prizePool: z.coerce.number()
        .min(100, { message: "Minimum prize pool is 100" })
        .max(2500, { message: "Maximum prize pool is 2500" }),
    type: z.nativeEnum(LobbyType),
    isPublic: z.boolean()
}).refine(data => {
    // Prize pool should be multiple of 100
    return data.prizePool % 100 === 0;
}
    , {
        path: ["prizePool"],
        message: "Prize pool should be multiple of 100"
    });

type CreateLobbyFormValues = z.infer<typeof createLobbySchema>;

const defaultValues: CreateLobbyFormValues = {
    name: "",
    gameType: LobbyGameType.GUESS_FIRST_FOUR,
    marketType: SchedulerType.NSE,
    maxCapacity: 10,
    prizePool: 100,
    roundTime: 3,
    type: LobbyType.PUBLIC,
    isPublic: true
};

type Props = {
    onCreate: () => void;
    gameType: LobbyGameType;
}
const CreateLobbyForm = ({ onCreate, gameType }: Props) => {
    const router = useRouter();
    const { mutate: createLobby, isPending } = useCreateLobby();

    const isNSEOpen = useNSEAvailable();
    const form = useForm<CreateLobbyFormValues>({
        resolver: zodResolver(createLobbySchema),
        defaultValues: { ...defaultValues, gameType }
    });

    const marketOptions = useMemo(() => {
        if (isNSEOpen) {
            return [
                { label: "NSE", value: SchedulerType.NSE },
                { label: "Crypto", value: SchedulerType.CRYPTO },
                { label: "Crypto", value: SchedulerType.USA_MARKET },
            ];
        }
        return [
            { label: "Crypto", value: SchedulerType.CRYPTO }
        ];
    }, [isNSEOpen]);

    const onSubmit = (formValue: CreateLobbyFormValues) => {
        createLobby({
            name: formValue.name,
            amount: formValue.prizePool,
            game_type: formValue.gameType,
            roundTime: formValue.roundTime,
            marketType: formValue.marketType,
            type: formValue.isPublic ? LobbyType.PUBLIC : LobbyType.PRIVATE,
        }, {
            onSuccess: (data) => {
                router.push(`/game/lobby/${data.joiningCode}`);
                form.reset(defaultValues);
                onCreate();
            }
        });
    };


    const currentGame = useMemo(() => {
        return LOBBY_GAMES.find(game => game.gameType === gameType);
    }, [gameType]);
    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="text-white text-xl">Create New Lobby for {currentGame?.title}</CardTitle>
                <CardDescription className="text-gray-400">{
                    currentGame?.description
                }</CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider
                    methods={form}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Lobby Name"
                            placeholder="Enter a unique lobby name"
                            className='text-white'
                            inputClassName="h-14 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>

                    <Separator className="bg-gray-800" />

                    {/* Settings Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Lobby Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroupSelect
                                control={form.control}
                                name="marketType"
                                label="Market Type"
                                labelClassName='text-white'
                                options={marketOptions}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />

                            <FormInput
                                control={form.control}
                                name="prizePool"
                                type="number"
                                className='text-white'
                                label="Prize Pool"
                                inputClassName="h-14 bg-gray-800 text-white border-gray-700"
                            />
                        </div>
                        {gameType === LobbyGameType.MINI_MUTUAL_FUND &&
                            <FormGroupSelect
                                control={form.control}
                                name="roundTime"
                                labelClassName='text-white'
                                label="Round Time"
                                options={[
                                    {
                                        label: "2 min", value: "2"
                                    },
                                    {
                                        label: "5 min", value: "5"
                                    },
                                    {
                                        label: "10 min", value: "10"
                                    },
                                    {
                                        label: "15 min", value: "100"
                                    },

                                ]}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />}
                        <FormSwitch
                            control={form.control}
                            name="isPublic"
                            label="Public Lobby"
                            game
                            description="Anyone can join this lobby"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Lobby"}
                    </Button>
                </FormProvider>
            </CardContent>
        </Card>
    );
};

export default CreateLobbyForm;