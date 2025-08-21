"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Globe, Shield } from 'lucide-react';

interface CompanyInfo {
    id: number;
    name: string;
    domain: string;
    logo?: string;
}

const CompanyContextBanner: React.FC = () => {
    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                // Get admin profile which includes company info
                const response = await fetch('/api/admin/profile', {
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const profile = await response.json();
                    setCompany(profile.data?.company || profile.company);
                }
            } catch (error) {
                console.error('Failed to fetch company info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyInfo();
    }, []);

    if (loading) {
        return (
            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-pulse bg-blue-200 rounded-full w-8 h-8"></div>
                        <div className="space-y-2">
                            <div className="animate-pulse bg-blue-200 rounded h-4 w-32"></div>
                            <div className="animate-pulse bg-blue-200 rounded h-3 w-24"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!company) return null;

    return (
        <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <div className="company-icon">
                        {company.logo ? (
                            <img 
                                src={company.logo} 
                                alt={company.name} 
                                className="w-8 h-8 rounded object-cover" 
                            />
                        ) : (
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                            Managing bonuses for: <span className="text-blue-600 font-semibold">{company.name}</span>
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                                <Globe className="w-3 h-3" />
                                <span>Domain: {company.domain}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Shield className="w-3 h-3" />
                                <span>Company ID: {company.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyContextBanner;
