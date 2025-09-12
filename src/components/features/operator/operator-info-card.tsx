import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Percent, User, Wallet } from "lucide-react";

type OperatorData = {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    percentageShare?: number;
    dmMaxBalance?: number;
    masterMaxBalance?: number;
    agentMaxBalance?: number;
    company?: {
        id?: number;
        name?: string;
        address?: string;
        contactPersonName?: string;
        contactPersonEmail?: string;
        domain?: string;
    };
    operatorWallet?: {
        id?: number;
        balance?: number;
        maxBalance?: number;
    };
    createdAt?: string | Date;
    updatedAt?: string | Date;
};

type Props = {
    operator: OperatorData;
};

const OperatorInfoCard = ({ operator }: Props) => {
    const formatCurrency = (amount?: number) => `Rs.${(amount || 0).toFixed(2)}`;
    
    const formatRole = (role?: string) => {
        if (!role) return 'N/A';
        return role.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Details Card */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Operator Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name</span>
                            <span className="font-medium">{operator.name || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="font-medium text-sm">{operator.email || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role</span>
                            <Badge variant="secondary">{formatRole(operator.role)}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center">
                                <Percent className="mr-1 h-3 w-3" />
                                Share
                            </span>
                            <span className="font-medium">{operator.percentageShare || 0}%</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex items-center mb-3">
                            <Building2 className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">Company Info</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Company</span>
                                <span>{operator.company?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Domain</span>
                                <span>{operator.company?.domain || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Contact</span>
                                <span>{operator.company?.contactPersonName || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Wallet & Limits Card */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Wallet className="mr-2 h-5 w-5" />
                        Wallet & Limits
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <div className="text-sm text-muted-foreground">Current Balance</div>
                        <div className="mt-1 text-2xl font-bold">
                            {formatCurrency(operator.operatorWallet?.balance)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Max: {formatCurrency(operator.operatorWallet?.maxBalance)}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-medium">Balance Limits</div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">DM Max Balance</span>
                                <span className="font-medium">{formatCurrency(operator.dmMaxBalance)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Master Max Balance</span>
                                <span className="font-medium">{formatCurrency(operator.masterMaxBalance)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Agent Max Balance</span>
                                <span className="font-medium">{formatCurrency(operator.agentMaxBalance)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Wallet ID</span>
                            <span>#{operator.operatorWallet?.id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Last Updated</span>
                            <span>{operator.updatedAt ? new Date(operator.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OperatorInfoCard;
