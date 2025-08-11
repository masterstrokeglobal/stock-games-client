import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyQR, { CompanyQRType } from "@/models/company-qr";

type Props = {
    companyQr?: CompanyQR;
    imageUrl?: string;
};

const DepositDetails = ({ companyQr, imageUrl }: Props) => {
    return (
        <Card className="w-full max-w-xl mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Deposit Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {companyQr && <>
                        {companyQr?.type === CompanyQRType.UPI ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Company QR Code</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <img
                                        src={companyQr.qr}
                                        alt="Company QR Code"
                                        className="w-48 h-48 object-contain mx-auto"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Bank Details</p>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Bank Name</p>
                                        <p className="font-medium">{companyQr?.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Account Holder Name</p>
                                        <p className="font-medium">{companyQr?.accountHolderName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Account Number</p>
                                        <p className="font-medium">{companyQr?.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">IFSC Code</p>
                                        <p className="font-medium">{companyQr?.ifscCode}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Payment Screenshot</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Payment Screenshot"
                                    className="w-full max-w-sm object-contain mx-auto rounded"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DepositDetails;