"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import FormProvider from '@/components/ui/form/form-provider';
import FormInput from '@/components/ui/form/form-input';
import FormGroupSelect from '@/components/ui/form/form-select';
import FormSwitch from '@/components/ui/form/form-switch';
import { useCreateLobby } from '@/react-query/lobby-query';
import { SchedulerType } from '@/models/market-item';
import { LobbyType } from '@/models/lobby';

export enum LobbyStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed",
}

export enum LobbyGameType {
    GUESS_FIRST = "guess_first",
    GUESS_LAST = "guess_last",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    GUESS_FIRST_THREE = "guess_first_three",
    GUESS_LAST_THREE = "guess_last_three",
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
    maxCapacity: z.coerce.number()
        .min(2, { message: "Minimum 2 players required" })
        .max(50, { message: "Maximum 50 players allowed" }),
    prizePool: z.coerce.number()
        .min(100, { message: "Minimum prize pool is 100" })
        .max(2500, { message: "Maximum prize pool is 2500" }),
    type: z.nativeEnum(LobbyType),
    isPublic: z.boolean()
});

type CreateLobbyFormValues = z.infer<typeof createLobbySchema>;

const defaultValues: CreateLobbyFormValues = {
    name: "",
    gameType: LobbyGameType.GUESS_FIRST,
    marketType: SchedulerType.NSE,
    maxCapacity: 10,
    prizePool: 100,
    type: LobbyType.PUBLIC,
    isPublic: true
};

const gameTypeOptions = [
    { label: "Guess First", value: LobbyGameType.GUESS_FIRST },
    { label: "Guess Last", value: LobbyGameType.GUESS_LAST },
    { label: "Guess First 8", value: LobbyGameType.GUESS_FIRST_EIGHT },
    { label: "Guess Last 8", value: LobbyGameType.GUESS_LAST_EIGHT },
    { label: "Guess First 3", value: LobbyGameType.GUESS_FIRST_THREE },
    { label: "Guess Last 3", value: LobbyGameType.GUESS_LAST_THREE },
];

type Props = {
    onCreate: () => void;
}
const CreateLobbyForm = ({ onCreate }: Props) => {
    const { mutate: createLobby, isPending } = useCreateLobby();

    const form = useForm<CreateLobbyFormValues>({
        resolver: zodResolver(createLobbySchema),
        defaultValues,
    });

    const onSubmit = (formValue: CreateLobbyFormValues) => {
        createLobby({
            name: formValue.name,
            amount: formValue.prizePool,
            game_type: formValue.gameType,
            marketType: formValue.marketType,
            type: formValue.isPublic ? LobbyType.PUBLIC : LobbyType.PRIVATE,
        }, {
            onSuccess: () => {
                form.reset(defaultValues);
                onCreate();
            }
        });
    };

    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="text-white">Create New Lobby</CardTitle>
                <CardDescription className="text-gray-400">Set up your game lobby</CardDescription>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroupSelect
                                control={form.control}
                                name="gameType"
                                labelClassName='text-white'
                                label="Game Type"
                                options={gameTypeOptions}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />
                        </div>
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
                                options={[
                                    { label: "NSE", value: SchedulerType.NSE },
                                    { label: "Crypto", value: SchedulerType.CRYPTO }
                                ]}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />

                            <FormGroupSelect
                                control={form.control}
                                name="prizePool"
                                labelClassName='text-white'
                                label="Prize Pool"
                                options={[
                                    { label: "100 Coins", value: "100" },
                                    { label: "500 Coins", value: "500" },
                                    { label: "1000 Coins", value: "1000" },
                                    { label: "2500 Coins", value: "2500" }
                                ]}
                                className="h-14 bg-gray-800 text-white border-gray-700"
                            />
                        </div>

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