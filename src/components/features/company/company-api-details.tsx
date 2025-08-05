import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Edit, Plus, Eye, EyeOff, Copy, Check } from "lucide-react";
import CompanyApiDetailsForm, { CompanyApiDetailsFormValues } from "./company-api-detail-form";
import {
    useGetCompanyApiDetails,
    useCreateCompanyApiDetails,
    useUpdateCompanyApiDetailsById,
    useDeleteCompanyApiDetailsById
} from "@/react-query/company-api-details";
import { toast } from "sonner";

type Props = {
    companyId: string;
};

const CompanyApiDetailsManager = ({ companyId }: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copiedApiKey, setCopiedApiKey] = useState(false);

    // Queries and mutations
    const { data: apiDetails, isLoading, error } = useGetCompanyApiDetails(companyId);
    const createMutation = useCreateCompanyApiDetails();
    const updateMutation = useUpdateCompanyApiDetailsById();
    const deleteMutation = useDeleteCompanyApiDetailsById();

    const hasApiDetails = apiDetails && !error;
    const isLoadingMutation = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    // Handle form submission
    const handleSubmit = async (data: CompanyApiDetailsFormValues) => {
        try {
            const submitData = {
                ...data,
                companyId,
            };

            if (isEditMode && hasApiDetails) {
                updateMutation.mutate({
                    id: apiDetails.id,
                    ...submitData
                });
            } else {
                createMutation.mutate(submitData);
            }
            
            setShowForm(false);
            setIsEditMode(false);
        } catch (error) {
            // Error handled by mutation onError
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!hasApiDetails) return;
        
        try {
             deleteMutation.mutate(apiDetails.id??0);
            toast.success("Company API details deleted successfully");
        } catch (error) {
            toast.error("Error deleting company API details");
        }
    };

    // Handle create new
    const handleCreateNew = () => {
        setIsEditMode(false);
        setShowForm(true);
    };

    // Handle edit
    const handleEdit = () => {
        setIsEditMode(true);
        setShowForm(true);
    };

    // Handle cancel
    const handleCancel = () => {
        setShowForm(false);
        setIsEditMode(false);
    };

    // Handle API key reveal toggle
    const toggleApiKeyVisibility = () => {
        setShowApiKey(!showApiKey);
    };

    // Handle API key copy
    const copyApiKey = async () => {
        if (!apiDetails?.apiKey) return;
        
        try {
            await navigator.clipboard.writeText(apiDetails.apiKey);
            setCopiedApiKey(true);
            toast.success("API key copied to clipboard");
            setTimeout(() => setCopiedApiKey(false), 2000);
        } catch (error) {
            toast.error("Failed to copy API key");
        }
    };

    // Prepare form default values for edit mode
    const getDefaultValues = (): CompanyApiDetailsFormValues | undefined => {
        if (!isEditMode || !hasApiDetails) return undefined;
        
        return {
            apiKey: apiDetails.apiKey,
            baseUrl: apiDetails.baseUrl,
            allowedIps: apiDetails.allowedIps,
            allowedGames: apiDetails.allowedGames.map(game => ({ value: game })),
        };
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading API details...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">API Configuration</h2>
                    <p className="text-muted-foreground">
                        Manage API access details for this company
                    </p>
                </div>
            </div>

            {/* Show form or details */}
            {showForm ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEditMode ? "Update API Details" : "Create API Details"}
                        </CardTitle>
                        <CardDescription>
                            {isEditMode 
                                ? "Update the API configuration for this company"
                                : "Configure API access for this company"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CompanyApiDetailsForm
                            defaultValues={getDefaultValues()}
                            onSubmit={handleSubmit}
                            isLoading={isLoadingMutation}
                        />
                        <div className="flex justify-start mt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={isLoadingMutation}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {hasApiDetails ? (
                        // Show existing API details
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>API Details</CardTitle>
                                        <CardDescription>
                                            Current API configuration for this company
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEdit}
                                            disabled={isLoadingMutation}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isLoadingMutation}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete API Details</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete the API configuration? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDelete}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Base URL</label>
                                    <p className="text-sm">{apiDetails.baseUrl}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">API Key</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 text-sm font-mono bg-muted p-2 rounded border">
                                            {apiDetails.apiKey ? (
                                                showApiKey ? apiDetails.apiKey : '●'.repeat(32)
                                            ) : (
                                                'Not set'
                                            )}
                                        </div>
                                        {apiDetails.apiKey && (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={toggleApiKeyVisibility}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={copyApiKey}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {copiedApiKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Allowed IPs</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {apiDetails.allowedIps.map((ip, index) => (
                                            <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                                                {ip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Allowed Games</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {apiDetails.allowedGames.map((game, index) => (
                                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                                {game}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        // Show create new button when no API details exist
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted p-3 mb-4">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No API Configuration Found</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    This company doesn't have API access configured yet. Create a new configuration to enable API access.
                                </p>
                                <Button
                                    onClick={handleCreateNew}
                                    disabled={isLoadingMutation}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create API Configuration
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default CompanyApiDetailsManager;