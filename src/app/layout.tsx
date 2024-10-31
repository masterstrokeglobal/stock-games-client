"use client";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { Suspense } from "react";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Include all weights
  subsets: ['latin'],  // Optional, but typically used for basic character sets
});


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
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <Suspense>
          <UserProvider >
            <QueryClientProvider client={queryClient}>
              <Toaster toastOptions={{ duration: 1500 }} position="top-right" richColors />
              {children}
            </QueryClientProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
