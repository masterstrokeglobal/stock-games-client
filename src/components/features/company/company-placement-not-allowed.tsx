import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Company from '@/models/company';
import { SchedulerType } from '@/models/market-item';
import { useAddPlacementNotAllowed,useRemovePlacementNotAllowed } from '@/react-query/company-queries';
import { AlertCircle, PlusCircle, XCircle } from 'lucide-react';
import React from 'react';

interface CompanyPlacementManagementProps {
    company: Company;
}

const CompanyPlacementManagement: React.FC<CompanyPlacementManagementProps> = ({ company }) => {
    const [selectedType, setSelectedType] = React.useState<SchedulerType | ''>('');

    const addCompanyPlacement = useAddPlacementNotAllowed();
    const removeCompanyPlacement = useRemovePlacementNotAllowed();

    const handleAddPlacement = () => {
        if (selectedType && company.id) {
            addCompanyPlacement.mutate({
                companyId: company.id.toString(),
                placementNotAllowed: selectedType
            });
            setSelectedType('');
        }
    };

    const handleRemovePlacement = (type: SchedulerType) => {
        if (company.id) {
            removeCompanyPlacement.mutate({
                companyId: company.id.toString(),
                placementNotAllowed: type
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>Company Placement Management</span>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                    Manage which placement types are not allowed for this company
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Select
                        value={selectedType}
                        onValueChange={(value) => setSelectedType(value as SchedulerType)}
                    >
                        <SelectTrigger className="w-full sm:w-[240px]">
                            <SelectValue placeholder="Select placement type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(SchedulerType).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleAddPlacement}
                        disabled={!selectedType || addCompanyPlacement.isPending}
                        className="w-full sm:w-auto"
                    >
                        {addCompanyPlacement.isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Restriction
                            </>
                        )}
                    </Button>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Current Restrictions</h4>

                    {company.placementNotAllowed?.length === 0 || !company.placementNotAllowed ? (
                        <Alert variant="default" className="bg-muted">
                            <AlertDescription>
                                No placement types are currently restricted
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {company.placementNotAllowed.map((type) => (
                                <Badge
                                    key={type}
                                    variant="secondary"
                                    className="flex items-center gap-1 pl-3 pr-1 py-1"
                                >
                                    <span>{type}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 hover:text-destructive"
                                        onClick={() => handleRemovePlacement(type)}
                                        disabled={removeCompanyPlacement.isPending}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span className="sr-only">Remove {type} restriction</span>
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyPlacementManagement;