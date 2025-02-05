"use client";
import { AudioProvider } from "@/context/audio-context";
import { UserProvider } from "@/context/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


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
            <AudioProvider>
                <UserProvider >
                    <QueryClientProvider client={queryClient}>
                        <Toaster toastOptions={{ duration: 1500 }} position="top-right" richColors />
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </UserProvider>
            </AudioProvider>
        </Suspense>
    );
}
