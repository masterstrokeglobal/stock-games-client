"use client";

import { useRouter } from 'next/navigation';
import EnhancedBonusForm from '@/components/features/bonus/enhanced-bonus-form';

const CreateBonusPage = () => {
    const router = useRouter();

    const handleSuccess = () => {
        router.push('/dashboard/bonus');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container-main my-12">
            <EnhancedBonusForm 
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default CreateBonusPage; 
