"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    useGetAllBonusCampaigns, 
    useUpdateBonusCampaign,
    useAssignBonus,
    useUpdateCampaignStatus,
    useDeleteBonusCampaign
} from '@/react-query/enhanced-bonus-queries';
import { Eye, Edit, Users, TrendingUp, Play, Pause, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BonusCampaignsList: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [triggerFilter, setTriggerFilter] = useState('all');
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [assignmentDialog, setAssignmentDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
    const [userId, setUserId] = useState('');
    const [depositAmount, setDepositAmount] = useState<number | undefined>();

    const { data: campaigns, isLoading } = useGetAllBonusCampaigns({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        triggerEvent: triggerFilter !== 'all' ? triggerFilter : undefined
    });

    const updateCampaignMutation = useUpdateBonusCampaign();
    const assignBonusMutation = useAssignBonus();
    const updateStatusMutation = useUpdateCampaignStatus();
    const deleteCampaignMutation = useDeleteBonusCampaign();

    // Ensure bonusCampaigns is always an array - moved here to follow Rules of Hooks
    const bonusCampaigns = React.useMemo(() => {
        if (Array.isArray(campaigns?.data)) {
            return campaigns.data;
        } else if (Array.isArray(campaigns)) {
            return campaigns;
        } else if (campaigns?.data?.campaigns && Array.isArray(campaigns.data.campaigns)) {
            return campaigns.data.campaigns;
        } else if (campaigns?.campaigns && Array.isArray(campaigns.campaigns)) {
            return campaigns.campaigns;
        } else {
            return [];
        }
    }, [campaigns]);

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

    const handleStatusChange = async (campaignId: string, newStatus: 'active' | 'inactive' | 'paused' | 'draft') => {
        try {
            await updateStatusMutation.mutateAsync({
                bonusId: campaignId,
                status: newStatus
            });
            toast.success(`Campaign ${newStatus === 'active' ? 'activated' : newStatus === 'inactive' ? 'deactivated' : newStatus} successfully`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update campaign status');
        }
    };

    const handleDeleteCampaign = async () => {
        if (!campaignToDelete) return;
        
        try {
            await deleteCampaignMutation.mutateAsync(campaignToDelete.id);
            toast.success('Campaign deleted successfully');
            setDeleteDialog(false);
            setCampaignToDelete(null);
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error('Failed to delete campaign');
        }
    };

    const handleManualAssignment = async () => {
        if (!selectedCampaign || !userId) {
            toast.error('Please enter a valid user ID');
            return;
        }

        try {
            await assignBonusMutation.mutateAsync({
                userId,
                bonusCampaignId: selectedCampaign.id.toString(),
                depositAmount
            });
            toast.success('Bonus assigned successfully');
            setAssignmentDialog(false);
            setUserId('');
            setDepositAmount(undefined);
        } catch (error) {
            console.error('Error assigning bonus:', error);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bonus Campaigns Management
                </CardTitle>
                
                {/* Filters */}
                <div className="flex gap-4 mt-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by trigger" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Triggers</SelectItem>
                            <SelectItem value="FIRST_DEPOSIT">First Deposit</SelectItem>
                            <SelectItem value="EVERY_DEPOSIT">Every Deposit</SelectItem>
                            <SelectItem value="LOSS_BASED">Loss Based</SelectItem>
                            <SelectItem value="WAGER_BASED">Wager Based</SelectItem>
                            <SelectItem value="LOGIN_BASED">Login Based</SelectItem>
                            <SelectItem value="GAME_SPECIFIC">Game Specific</SelectItem>
                            <SelectItem value="TIME_LIMITED">Time Limited</SelectItem>
                            <SelectItem value="CUSTOM_EVENT">Custom Event</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Trigger Event</TableHead>
                            <TableHead>Bonus Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Wager Requirement</TableHead>
                            <TableHead>Direct Credit</TableHead>
                            <TableHead>Payment Categories</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Usage Count</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bonusCampaigns && bonusCampaigns.length > 0 ? bonusCampaigns.map((campaign: any) => (
                            <TableRow key={campaign.id || campaign._id || Math.random()}>
                                <TableCell className="font-medium">
                                    {campaign.bonusName || campaign.name || 'Unnamed Campaign'}
                                </TableCell>
                                <TableCell>
                                    {getTriggerEventDisplay(campaign.triggerEvent || 'unknown')}
                                </TableCell>
                                <TableCell>
                                    {getTriggerEventDisplay(campaign.bonusType || 'unknown')}
                                </TableCell>
                                <TableCell>
                                    {campaign.bonusType === 'PERCENTAGE' ? `${campaign.bonusValue}%` : `$${campaign.bonusValue}`}
                                </TableCell>
                                <TableCell>
                                    {campaign.wagerRequirementType === 'NONE' ? 'None' : `${campaign.wagerRequirementValue}x`}
                                </TableCell>
                                <TableCell>
                                    {campaign.directMainCredit ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell className="max-w-[240px] truncate">
                                    {Array.isArray(campaign.applicablePaymentCategories) && campaign.applicablePaymentCategories.length > 0
                                        ? campaign.applicablePaymentCategories.map(cat => {
                                            const icon = cat === 'CRYPTOCURRENCY' ? '🪙' : 
                                                       cat === 'BANK_TRANSFER' ? '🏦' : 
                                                       cat === 'INTERNAL_TRANSFER' ? '🔄' : '';
                                            return `${icon} ${cat.replace('_', ' ')}`;
                                        }).join(', ')
                                        : 'All Categories'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(campaign.status || 'inactive')}>
                                        {(campaign.status || 'inactive').charAt(0).toUpperCase() + (campaign.status || 'inactive').slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {campaign.currentUsageCount || 0}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>{campaign.bonusName}</DialogTitle>
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

                                        <Select
                                            value={campaign.status || 'inactive'}
                                            onValueChange={(value) => handleStatusChange(campaign.id, value as 'active' | 'inactive' | 'paused' | 'draft')}
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

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setCampaignToDelete(campaign);
                                                setDeleteDialog(true);
                                            }}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <Dialog open={assignmentDialog} onOpenChange={setAssignmentDialog}>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setSelectedCampaign(campaign)}
                                                >
                                                    <Users className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Manual Bonus Assignment</DialogTitle>
                                                    <DialogDescription>
                                                        Assign "{selectedCampaign?.bonusName}" to a specific user
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium">User ID *</label>
                                                        <Input
                                                            value={userId}
                                                            onChange={(e) => setUserId(e.target.value)}
                                                            placeholder="Enter user ID"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Deposit Amount (if applicable)</label>
                                                        <Input
                                                            type="number"
                                                            value={depositAmount || ''}
                                                            onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
                                                            placeholder="Enter deposit amount"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={() => setAssignmentDialog(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button 
                                                            onClick={handleManualAssignment}
                                                            disabled={assignBonusMutation.isPending}
                                                        >
                                                            {assignBonusMutation.isPending ? 'Assigning...' : 'Assign Bonus'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    {isLoading ? 'Loading campaigns...' : 'No bonus campaigns found. Create your first campaign to get started.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the campaign "{campaignToDelete?.name}"? 
                            This action cannot be undone and will permanently remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setDeleteDialog(false);
                                setCampaignToDelete(null);
                            }}
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
        </Card>
    );
};

export default BonusCampaignsList;
