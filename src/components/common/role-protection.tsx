"use client";

import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import { OperatorRole } from "@/models/operator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "./loading-screen";

interface RoleProtectionProps {
  children: React.ReactNode;
  allowedRoles: (AdminRole | OperatorRole)[];
  redirectTo?: string;
}

export default function RoleProtection({ 
  children, 
  allowedRoles, 
  redirectTo = "/dashboard" 
}: RoleProtectionProps) {
  const { userDetails, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userDetails) {
      const admin = userDetails as Admin;
      if (admin.role && !allowedRoles.includes(admin.role)) {
        router.push(redirectTo);
      }
    }
  }, [userDetails, loading, allowedRoles, redirectTo, router]);

  if (loading) {
    return <LoadingScreen className="h-screen" />;
  }

  if (!userDetails) {
    return <LoadingScreen className="h-screen" />;
  }

  const admin = userDetails as Admin;
  if (!admin.role || !allowedRoles.includes(admin.role)) {
    return <LoadingScreen className="h-screen" />;
  }

  return <>{children}</>;
}
