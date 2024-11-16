import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionStatus } from "@/models/transaction";
import { CheckCircle, XCircle } from "lucide-react";

const TransactionStatusAlert = ({ currentStatus }: { currentStatus: TransactionStatus }) => {
    if (currentStatus === TransactionStatus.PENDING) return null;

    const isCompleted = currentStatus === TransactionStatus.COMPLETED;
    const statusIcon = isCompleted ? <CheckCircle className="text-green-600 w-5 h-5" /> : <XCircle className="text-red-600 w-5 h-5" />;
    const statusText = isCompleted ? "completed" : "cancelled";

    return (
        <Alert className="mt-6 bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
                {statusIcon}
                <div>
                    <AlertTitle className="font-semibold text-gray-800">
                        Transaction {statusText.toUpperCase()}
                    </AlertTitle>
                    <AlertDescription className="text-gray-600">
                        This transaction has already been {statusText}. No further changes can be made.
                    </AlertDescription>
                </div>
            </div>
        </Alert>
    );
};

export default TransactionStatusAlert;
