"use client";

import AdminProfitDistribution from "@/components/features/operator/admin-profit-distribution";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import { redirect } from "next/navigation";

const AdminProfitDistributionPage = () => {
    const { userDetails } = useAuthStore();
    const admin = userDetails as Admin;

    // Only company admins can access this page
    if (!admin || admin.role !== AdminRole.COMPANY_ADMIN) {
        redirect("/dashboard");
    }

    return (
        <div className="container-main max-w-7xl mx-auto p-6">
            <AdminProfitDistribution />
        </div>
    );
};

export default AdminProfitDistributionPage;
