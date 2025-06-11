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
import { useForm, Controller, Control } from "react-hook-form";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";

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
    prizePool: z.coerce.number()
        .min(100, { message: "Minimum prize pool is 100" })
        .max(2500, { message: "Maximum prize pool is 2500" }),
    type: z.nativeEnum(LobbyType),
    isPublic: z.boolean()
}).refine(data => {
    // Prize pool should be multiple of 100
    return data.prizePool % 100 === 0;
},
    {
        path: ["prizePool"],
        message: "Prize pool should be multiple of 100"
    });

type CreateLobbyFormValues = z.infer<typeof createLobbySchema>;

const defaultValues: CreateLobbyFormValues = {
    name: "",
    gameType: LobbyGameType.GUESS_FIRST_FOUR,
    marketType: SchedulerType.NSE,
    maxCapacity: 10,
    prizePool: 1000,
    roundTime: 3,
    type: LobbyType.PUBLIC,
    isPublic: true
};

interface RoundTimeOption {
    value: number;
    label: string;
}

const roundTimeOptions: RoundTimeOption[] = [
    { value: 2, label: "2 min" },
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 15, label: "15 min" },
];


interface MarketOption {
    label: string;
    value: SchedulerType;
}

interface Props {
    onCreate: () => void;
    gameType: LobbyGameType;
}

const CreateLobbyForm = ({ onCreate, gameType }: Props): JSX.Element => {
    const router = useRouter();
    const { mutate: createLobby, isPending } = useCreateLobby();

    const isNSEOpen = useNSEAvailable();
    const form = useForm<CreateLobbyFormValues>({
        resolver: zodResolver(createLobbySchema),
        defaultValues: { ...defaultValues, gameType }
    });

    const marketOptions = useMemo<MarketOption[]>(() => {
        if (isNSEOpen) {
            return [
                { label: "NSE", value: SchedulerType.NSE },
                { label: "Crypto", value: SchedulerType.CRYPTO },
                { label: "US Market", value: SchedulerType.USA_MARKET },
            ];
        }
        return [
            { label: "Crypto", value: SchedulerType.CRYPTO }
        ];
    }, [isNSEOpen]);

    const onSubmit = (formValue: CreateLobbyFormValues): void => {
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

    const handleDecreasePrize = (currentValue: number, onChange: (value: number) => void): void => {

        if (currentValue > 100) {
            onChange(currentValue - 100);
        }
    };

    const handleIncreasePrize = (currentValue: number, onChange: (value: number) => void): void => {
        if (currentValue < 2500) {
            onChange(currentValue + 100);
        }
    };

    // Component for Round Time Radio Button
    const RoundTimeRadio: React.FC<{
        control: Control<CreateLobbyFormValues>;
    }> = ({ control }) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white">Round Time</label>
            <Controller
                control={control}
                name="roundTime"
                render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                        {roundTimeOptions.map((option) => (
                            <div key={option.value} className="flex">
                                <button
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={`px-4 py-2 rounded-md font-medium ${field.value === option.value
                                            ? "bg-yellow-500 text-white"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            />
        </div>
    );

    const PrizePoolControl: React.FC<{
        control: Control<CreateLobbyFormValues>;
    }> = ({ control }) => (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Prize Pool</label>
            <Controller
                control={control}
                name="prizePool"
                render={({ field }) => (
                    <div className="flex items-center justify-center gap-6">
                        {/* Decrease Button */}
                        <button
                            type="button"
                            onClick={() => handleDecreasePrize(field.value, field.onChange)}
                            disabled={field.value <= 100}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 text-white border border-blue-600 disabled:opacity-50 transition"
                        >
                            <Minus size={18} />
                        </button>

                        <div className="max-w-sm w-full rounded-xl overflow-hidden shadow-lg border-4 border-yellow-400">
                            <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 py-2 px-2 text-center font-bold text-gray-900 text-sm tracking-wide flex justify-center items-center gap-2">
                                <img src="/images/coin.png" alt="coin" className="w-5 h-5" />
                                Entry Fees
                            </div>

                            <div className="bg-gray-900 py-3 text-center">
                                <div className="text-yellow-300 font-bold text-base">
                                    {field.value.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Increase Button */}
                        <button
                            type="button"
                            onClick={() => handleIncreasePrize(field.value, field.onChange)}
                            disabled={field.value >= 2500}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 text-white border border-blue-600 disabled:opacity-50 transition"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                )}
            />
        </div>
    );


    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="text-white text-xl">Create New Lobby for {currentGame?.title}</CardTitle>
                <CardDescription className="text-gray-400">{currentGame?.description}</CardDescription>
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
                            className="text-white"
                            inputClassName="h-14 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400 focus:bg-gray-800/90"
                        />
                    </div>

                    <Separator className="bg-gray-800" />

                    {/* Settings Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">Lobby Settings</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <FormGroupSelect
                                control={form.control}
                                name="marketType"
                                label="Market Type"
                                labelClassName="text-white"
                                options={marketOptions}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />

                            {/* Round Time Radio Buttons */}
                            <RoundTimeRadio control={form.control} />

                            {/* Prize Pool Selection with Increase/Decrease Buttons */}
                            <PrizePoolControl control={form.control} />

                            <FormSwitch
                                control={form.control}
                                name="isPublic"
                                label="Public Lobby"
                                game
                                description="Anyone can join this lobby"
                            />
                        </div>
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