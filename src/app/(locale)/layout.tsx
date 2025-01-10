"use client";
import { UserProvider } from "@/context/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Suspense>
            <UserProvider >
                <QueryClientProvider client={queryClient}>
                    <Toaster toastOptions={{ duration: 1500 }} position="top-right" richColors />
                    {children}
                </QueryClientProvider>
            </UserProvider>
        </Suspense>
    );
}
