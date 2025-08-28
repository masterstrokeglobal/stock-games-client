"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    handleBonusDeletionError,
    handleBonusUpdateError
} from '@/lib/utils/bonus-error-handler';
import {
    useDeleteBonusCampaign,
    useUpdateCampaignStatus
} from '@/react-query/enhanced-bonus-queries';
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Edit, Eye, Pause, Play, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface BonusCampaign {
    id: string;
    bonusName?: string;
    name?: string;
    triggerEvent: string;
    bonusType: string;
    bonusValue: number;
    wagerRequirementType: string;
    wagerRequirementValue?: number;
    directMainCredit: boolean;
    applicablePaymentCategories: string[];
    status: string;
    currentUsageCount: number;
    description?: string;
    applicableProviders?: string[];
    minDeposit?: number;
    maxBonusAmount?: number;
    validityDays?: number;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
        case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getTriggerEventDisplay = (trigger: string) => {
    return trigger.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const ActionsColumn = ({ campaign }: { campaign: BonusCampaign }) => {
    const router = useRouter();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const updateStatusMutation = useUpdateCampaignStatus();
    const deleteCampaignMutation = useDeleteBonusCampaign();

    const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'paused' | 'draft') => {
        try {
            await updateStatusMutation.mutateAsync({
                bonusId: campaign.id,
                status: newStatus
            });
            toast.success(`Campaign ${newStatus === 'active' ? 'activated' : newStatus === 'inactive' ? 'deactivated' : newStatus} successfully`);
        } catch (error: any) {
            console.error('Error updating status:', error);
            handleBonusUpdateError(error, router.push);
        }
    };

    const handleDeleteCampaign = async () => {
        try {
            await deleteCampaignMutation.mutateAsync(campaign.id);
            toast.success('Campaign deleted successfully');
            setDeleteDialog(false);
        } catch (error: any) {
            console.error('Error deleting campaign:', error);
            handleBonusDeletionError(error, router.push);
        }
    };


    return (
        <div className="flex gap-2">
      
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{campaign.bonusName || campaign.name}</DialogTitle>
                        <DialogDescription>
                            Campaign Details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Description:</strong>
                                <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                            </div>
                            <div>
                                <strong>Providers:</strong>
                                <p className="text-sm text-gray-600 mt-1">
                                    {campaign.applicableProviders?.join(', ') || 'All Providers'}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <strong>Min Deposit:</strong>
                                <p className="text-sm text-gray-600 mt-1">${campaign.minDeposit || 0}</p>
                            </div>
                            <div>
                                <strong>Max Bonus:</strong>
                                <p className="text-sm text-gray-600 mt-1">${campaign.maxBonusAmount || 'No Limit'}</p>
                            </div>
                            <div>
                                <strong>Validity:</strong>
                                <p className="text-sm text-gray-600 mt-1">{campaign.validityDays || 'No Expiry'} days</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status Change Select */}
            <Select
                value={campaign.status || 'inactive'}
                onValueChange={(value) => handleStatusChange(value as 'active' | 'inactive' | 'paused' | 'draft')}
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">
                        <div className="flex items-center gap-2">
                            <Play className="h-3 w-3" />
                            Active
                        </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                            <Pause className="h-3 w-3" />
                            Inactive
                        </div>
                    </SelectItem>
                    <SelectItem value="paused">
                        <div className="flex items-center gap-2">
                            <Pause className="h-3 w-3" />
                            Paused
                        </div>
                    </SelectItem>
                    <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                            <Edit className="h-3 w-3" />
                            Draft
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Delete Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

         
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Campaign
                        </DialogTitle>
                        <DialogDescription>
                          {`Are you sure you want to delete the campaign "${campaign.bonusName || campaign.name}"? This action cannot be undone and will permanently remove all associated data.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteCampaign}
                            disabled={deleteCampaignMutation.isPending}
                        >
                            {deleteCampaignMutation.isPending ? 'Deleting...' : 'Delete Campaign'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const bonusCampaignsColumns: ColumnDef<BonusCampaign>[] = [
    {
        header: "CAMPAIGN NAME",
        accessorKey: "bonusName",
        cell: ({ row }) => (
            <div className="font-medium w-48 truncate">
                {row.original.bonusName || row.original.name || 'Unnamed Campaign'}
            </div>
        ),
    },
    {
        header: "TRIGGER EVENT",
        accessorKey: "triggerEvent",
        cell: ({ row }) => (
            <div className="w-32 truncate">
                {getTriggerEventDisplay(row.original.triggerEvent || 'unknown')}
            </div>
        ),
    },
    {
        header: "BONUS TYPE",
        accessorKey: "bonusType",
        cell: ({ row }) => (
            <div className="w-32 truncate">
                {getTriggerEventDisplay(row.original.bonusType || 'unknown')}
            </div>
        ),
    },
    {
        header: "VALUE",
        accessorKey: "bonusValue",
        cell: ({ row }) => (
            <div className="w-24">
                {row.original.bonusType === 'PERCENTAGE' 
                    ? `${row.original.bonusValue}%` 
                    : `$${row.original.bonusValue}`}
            </div>
        ),
    },
    {
        header: "WAGER REQUIREMENT",
        accessorKey: "wagerRequirementValue",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.wagerRequirementType === 'NONE' 
                    ? 'None' 
                    : `${row.original.wagerRequirementValue}`}
            </div>
        ),
    },
    {
        header: "DIRECT CREDIT",
        accessorKey: "directMainCredit",
        cell: ({ row }) => (
            <div className="w-24">
                {row.original.directMainCredit ? 'Yes' : 'No'}
            </div>
        ),
    },
    {
        header: "PAYMENT CATEGORIES",
        accessorKey: "applicablePaymentCategories",
        cell: ({ row }) => (
            <div className="max-w-[240px] truncate">
                {Array.isArray(row.original.applicablePaymentCategories) && row.original.applicablePaymentCategories.length > 0
                    ? row.original.applicablePaymentCategories.map((cat: string) => {
                        const icon = cat === 'CRYPTOCURRENCY' ? '🪙' : 
                                   cat === 'BANK_TRANSFER' ? '🏦' : 
                                   cat === 'INTERNAL_TRANSFER' ? '🔄' : '';
                        return `${icon} ${cat.replace('_', ' ')}`;
                    }).join(', ')
                    : 'All Categories'}
            </div>
        ),
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.original.status || 'inactive')}>
                {(row.original.status || 'inactive').charAt(0).toUpperCase() + (row.original.status || 'inactive').slice(1)}
            </Badge>
        ),
    },
    {
        header: "USAGE COUNT",
        accessorKey: "currentUsageCount",
        cell: ({ row }) => (
            <div className="w-24">
                {row.original.currentUsageCount || 0}
            </div>
        ),
    },
    {
        header: "ACTIONS",
        accessorKey: "actions",
        cell: ({ row }) => <ActionsColumn campaign={row.original} />,
    },
];

export default bonusCampaignsColumns;
