import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Building, Mail, User, Globe, Calendar, Coins } from 'lucide-react'; // Import icons for better visual presentation
import Company from '@/models/company'; // Adjust the path as needed

interface CompanyCardProps {
    company: Company;
    showBonusPercentage?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, showBonusPercentage=false }) => {
    return (
        <div className="bg-white border rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <div className="flex items-center mb-2">
                <Building className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Name:</span>
                <span className="ml-auto">{company.name || 'N/A'}</span>
            </div>
            <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Contact Person:</span>
                <span className="ml-auto">{company.contactPersonName || 'N/A'}</span>
            </div>
            <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Contact Email:</span>
                <span className="ml-auto">{company.contactPersonEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center mb-2">
                <Globe className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Domain:</span>
                <span className="ml-auto">{company.domain || 'N/A'}</span>
            </div>
            {showBonusPercentage && <div className="flex items-center mb-2">
                <Coins className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Bonus Percentage:</span>
                <span className="ml-auto">{company.depositBonusPercentage || 'N/A'}</span>
            </div>}
            <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-medium">Created At:</span>
                <span className="ml-auto">
                    {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                </span>
            </div>
            <Separator className="my-4" />
            {company.logo && (
                <div className="flex justify-center mb-4">
                    <img
                        src={company.logo}
                        alt={`${company.name} Logo`}
                        className="w-24 h-24 object-contain"
                    />
                </div>
            )}
            <div className="bg-gray-100 p-3 rounded-lg">
                <p className="font-medium text-gray-800">Address:</p>
                <p className="text-gray-600">{company.address || 'N/A'}</p>
            </div>
        </div>
    );
};

export default CompanyCard;
