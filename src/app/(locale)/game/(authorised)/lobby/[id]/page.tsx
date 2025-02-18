"use client";
import Container from '@/components/common/container';
import LoadingScreen from '@/components/common/loading-screen';
import Navbar from '@/components/features/game/navbar';
import LobbyChatSection from '@/components/features/lobby/lobby-chat';
import LobbyChatSheet from '@/components/features/lobby/lobby-chat-sheet';
import LobbyPlayers from '@/components/features/lobby/lobby-players';
import LobbySettings from '@/components/features/lobby/lobby-settings';
import useLobbyWebSocket from '@/components/features/lobby/lobby-websocket';
import TimeLeft from '@/components/features/lobby/time-left';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { useGetCurrentLobbyRound, useGetLobbyByCode } from '@/react-query/lobby-query';
import dayjs from 'dayjs';
import { Gamepad2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const LobbyWithChat = () => {
  const lobbyCode = useParams().id!.toString();
  const { data: lobby, isLoading } = useGetLobbyByCode(lobbyCode);
  const { data: lobbyRound } = useGetCurrentLobbyRound(lobby?.id);
  const { sendMessage } = useLobbyWebSocket({
    lobbyCode: lobbyCode,
    lobbyId: lobby?.id
  });

  useEffect(() => {
    if (lobby?.lobbyUsers) {
      console.log('Lobby users updated:', lobby.lobbyUsers.length);
    }
  }, [lobby?.lobbyUsers]);



  if (isLoading) return <LoadingScreen className='bg-primary-game text-white  min-h-screen' />;

  return (
    <div className='bg-primary-game w-full'>
      <Container className="flex flex-col items-center min-h-screen pt-24">
        <Navbar />
        <div className="w-full  mx-auto mt-8 ">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {/* Game Info Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between items-start  mb-6">
                    <div className="flex sm:items-center items-start sm:flex-row flex-col  w-full md:w-fit gap-4">
                      <div className="flex justify-between  md:w-fit w-full">
                        <div className="p-3 bg-gray-800 rounded-lg">
                          <Gamepad2 className="w-6 h-6 text-[#EEC53C]" />
                        </div>
                        {lobby && <LobbyChatSheet className='md:hidden block' lobby={lobby} onSend={sendMessage} />}
                      </div>

                      <div>
                        <h3 className="text-white font-semibold text-xl">{lobby?.name}</h3>
                        <div className="flex sm:flex-row flex-col  sm:items-center sm:justify-between items-start gap-4 mt-1">
                          <span className="text-sm text-gray-400">Game: {lobby?.getTypeName}</span>
                          <span className="text-sm text-gray-400">Created At: {dayjs(lobby?.startTime).format(" MMM DD, YYYY hh:mm A")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:items-center items-star gap-4">
                      {lobbyRound?.roundRecord?.endTime && <TimeLeft endTime={lobbyRound.roundRecord?.endTime} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Entry Fee</div>
                      <div className="text-[#EEC53C] font-semibold">{lobby?.amount} Coins</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Players</div>
                      <div className="text-white font-semibold">{lobby?.lobbyUsers?.length}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Status</div>
                      <div className="text-green-400 font-semibold">{lobby?.status}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Market</div>
                      <div className="text-[#EEC53C] font-semibold capitalize">{lobby?.marketType}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Total Prize</div>
                      <div className="text-[#EEC53C] font-semibold">{lobby?.totalPool} Coins</div>
                    </div>
                  </div>

                  <Progress value={lobby?.userPercentage} />
                </CardContent>
              </Card>
              {/* Players Card */}
              {lobby && <LobbyPlayers lobby={lobby} />}

              {lobby && <LobbySettings lobby={lobby} />}

            </div>
            {/* Right Side - Chat */}

            {lobby && <LobbyChatSection className='md:block hidden' lobbyId={lobby.id!} onSend={sendMessage} />}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LobbyWithChat;