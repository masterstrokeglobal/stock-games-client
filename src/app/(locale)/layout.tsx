"use client";
import { AudioProvider } from "@/context/audio-context";
import { UserProvider } from "@/context/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import ThemeManager from "./dashboard/theme-manager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  const [messages, setMessages] = useState({});

  useEffect(() => {
    // Dynamically import messages based on locale
    const loadMessages = async () => {
      try {
        const msgs = await import(`../../../messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error);
        // Fallback to English
        try {
          const fallbackMsgs = await import(`../../../messages/en.json`);
          setMessages(fallbackMsgs.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback messages:', fallbackError);
          setMessages({});
        }
      }
    };

    loadMessages();
  }, [locale]);

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Suspense>
                <AudioProvider>
                    <UserProvider>
                        <QueryClientProvider client={queryClient}>
                            <ThemeManager />
                            <Toaster toastOptions={{ duration: 1500 }}  position="top-right" richColors />
                            {children}
                            <ReactQueryDevtools initialIsOpen={false} />
                        </QueryClientProvider>
                    </UserProvider>
                </AudioProvider>
            </Suspense>
        </NextIntlClientProvider>
    );
}
