import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assuming these components are available
import { DollarSign, TrendingUp, Briefcase } from "lucide-react"; // Icons for decoration
import React from "react";

const CompanyEarningsCard: React.FC = () => {
    // Dummy data for demonstration purposes (in rupees)
    const totalEarnings = 1500000; // Total earnings in rupees
    const totalProfits = 500000; // Total profit in rupees
    const totalIncoming = 2000000; // Total incoming revenue in rupees

    return (
        <Card className=" border shadow-none bg-white">
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">Company Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Total Earnings */}
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-md shadow-sm">
                        <DollarSign className="text-green-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Earnings</p>
                            <p className="text-2xl font-bold text-green-800">₹{totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Profits */}
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-md shadow-sm">
                        <TrendingUp className="text-blue-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Profits</p>
                            <p className="text-2xl font-bold text-blue-800">₹{totalProfits.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Total Incoming Revenue */}
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-md shadow-sm">
                        <Briefcase className="text-yellow-600 w-8 h-8" />
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Incoming</p>
                            <p className="text-2xl font-bold text-yellow-800">₹{totalIncoming.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyEarningsCard;
