import { toast } from 'sonner';

export interface BonusAPIError {
    message?: string;
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
        status?: number;
    };
}

export const handleBonusAPIError = (error: BonusAPIError, navigate?: (path: string) => void) => {
    console.error('Bonus API Error:', error);

    // Extract error message
    const errorMessage = error.message || 
                        error.response?.data?.message || 
                        error.response?.data?.error || 
                        'An unexpected error occurred';

    // Company context errors
    if (errorMessage.includes('Company ID is required') || 
        errorMessage.includes('company context') ||
        errorMessage.includes('authentication')) {
        console.warn('Admin not properly authenticated or missing company context');
        toast.error('Authentication error. Please log in again.');
        
        // Clear invalid token and redirect to login
        if (navigate) {
            localStorage.removeItem('admin_token');
            navigate('/admin/login');
        }
        return;
    }

    if (errorMessage.includes("don't have access") || 
        errorMessage.includes('permission denied') ||
        errorMessage.includes('unauthorized')) {
        toast.error('You don\'t have permission to access this resource');
        return;
    }

    if (errorMessage.includes('not found') || 
        errorMessage.includes('does not exist')) {
        toast.error('Resource not found or has been deleted');
        return;
    }

    if (errorMessage.includes('validation') || 
        errorMessage.includes('invalid')) {
        toast.error(`Validation error: ${errorMessage}`);
        return;
    }

    // Network or server errors
    if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
        return;
    }

    if (error.response?.status === 503) {
        toast.error('Service temporarily unavailable. Please try again later.');
        return;
    }

    // Generic error fallback
    toast.error(errorMessage);
};

// Specific error handlers for different operations
export const handleBonusCreationError = (error: BonusAPIError, navigate?: (path: string) => void) => {
    if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        toast.error('A bonus campaign with this name already exists');
        return;
    }
    handleBonusAPIError(error, navigate);
};

export const handleBonusUpdateError = (error: BonusAPIError, navigate?: (path: string) => void) => {
    if (error.message?.includes('cannot modify') || error.message?.includes('in use')) {
        toast.error('Cannot modify this campaign while it\'s active or has active assignments');
        return;
    }
    handleBonusAPIError(error, navigate);
};

export const handleBonusDeletionError = (error: BonusAPIError, navigate?: (path: string) => void) => {
    if (error.message?.includes('cannot delete') || error.message?.includes('in use')) {
        toast.error('Cannot delete this campaign while it has active assignments');
        return;
    }
    handleBonusAPIError(error, navigate);
};

export const handleBonusAssignmentError = (error: BonusAPIError, navigate?: (path: string) => void) => {
    if (error.message?.includes('already assigned') || error.message?.includes('duplicate')) {
        toast.error('Bonus already assigned to this user');
        return;
    }
    if (error.message?.includes('eligibility') || error.message?.includes('requirements')) {
        toast.error('User does not meet bonus eligibility requirements');
        return;
    }
    handleBonusAPIError(error, navigate);
};
