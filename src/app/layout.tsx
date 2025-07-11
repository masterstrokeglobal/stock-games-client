import { HIGHLIGHT_APP_KEY } from '@/lib/utils';
import { HighlightInit } from '@highlight-run/next/client';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import "./game.css";
import "./globals.css";
import "./shuffle.css";

import {
  FpjsProvider
} from '@fingerprintjs/fingerprintjs-pro-react';
import Body from './body';


export default async function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
const locale = await getLocale();
const messages = await getMessages();

const fingerprintAPIKey = process.env.NEXT_PUBLIC_FINGERPRINT_ID ?? "";
const oneSingnalCode = process.env.NEXT_PUBLIC_ONE_SIGNAL ?? "";
return (
  <>
    <Analytics />
    {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />}
    <HighlightInit
      projectId={HIGHLIGHT_APP_KEY}
      serviceName="my-nextjs-frontend"
      tracingOrigins
      networkRecording={{
        enabled: false,
        recordHeadersAndBody: true,
        urlBlocklist: [],
      }}
    />
    <FpjsProvider
      loadOptions={{
        apiKey: fingerprintAPIKey,
        region: "ap"
      }}
    >
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}>
        <html lang={locale}>
          <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
            <Script id="onesignal-script" dangerouslySetInnerHTML={{
              __html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: ${oneSingnalCode},
              });

            });
          `}} />
            <title>Stock Games </title>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Keania+One:wght@400&display=swap" as="style" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Keania+One:wght@400&display=swap" />
            <link href="https://fonts.googleapis.com/css2?family=Sansation:wght@300;400;700&display=swap" rel="stylesheet" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
          </head>
            <Body>
              <NuqsAdapter>
                <NextIntlClientProvider messages={messages}>
                  {children}
                </NextIntlClientProvider>
              </NuqsAdapter>
            </Body>
        </html>
      </GoogleOAuthProvider>
    </FpjsProvider>
  </>
);
}


