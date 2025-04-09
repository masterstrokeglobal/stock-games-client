import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Clock, Info, Shield } from "lucide-react"

export default function SupportCard({ className }: PropsWithClassName) {
    return (
        <div className={cn("w-full mx-auto", className)}>
            {/* Support Banner */}
            <Card className="border-0 shadow-lg ">
                {/* Top Support Section */}
                <div className="bg-gradient-to-r from-primary-game to-primary-game p-4 relative">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-pink-700/20">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <div className="text-center">
                            <h2 className="text-white font-semibold text-xl flex items-center justify-center gap-2">
                                <Clock className="h-5 w-5" />
                                Need help? Our 24/7 support team is here for you anytime!
                            </h2>
                        </div>

                        <Button variant="ghost" size="icon" className="text-white hover:bg-pink-700/20">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <CardContent className="p-0">
                    {/* Security Section */}
                    <div className="bg-white p-6">
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                <Shield className="h-12 w-12 text-green-600" />
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">100% Safe</h3>
                                <p className="text-gray-600">
                                    Your data is safe with encrypted protection. Enjoy a secure and private connection.
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Main Content */}
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-grow">
                                <p className="text-gray-700 leading-relaxed">
                                  {`  StockGame provides a smooth and secure betting experience with a variety of reliable payment options.
                                    Whether you're placing bets on casino games or sports, our platform ensures quick and hassle-free
                                    transactions. Enjoy the convenience of seamless deposits and withdrawals, and focus on the thrill of
                                    the game.`}
                                </p>
                                <p className="text-gray-500 text-sm mt-4">
                                    © Copyright 2024. All Rights Reserved. Powered by StockGame.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-0">
                    <div className="w-full bg-gray-800 text-white text-center py-3 text-sm font-medium flex items-center justify-center gap-2">
                        <Info className="h-4 w-4" />
                        RULES & REGULATIONS © 2025
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
