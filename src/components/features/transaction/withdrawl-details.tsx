import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawDetailsRecord from '@/models/withdrawl-details';

type Props = {
    withdrawDetails: WithdrawDetailsRecord;
};
const WithdrawalDetails = ({ withdrawDetails }: Props) => {
    const hasUpi = withdrawDetails.upiId;

    return (
        <Card className="w-full max-w-xl mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {!hasUpi ? 'Bank Details' : 'UPI Details'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!hasUpi ? (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Account Holder</p>
                        <p className="font-medium">{withdrawDetails.accountName}</p>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium">{withdrawDetails.accountNumber}</p>
                        <p className="text-sm text-gray-600">IFSC Code</p>
                        <p className="font-medium">{withdrawDetails.ifscCode}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">UPI ID</p>
                        <p className="font-medium">{withdrawDetails.upiId}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WithdrawalDetails;