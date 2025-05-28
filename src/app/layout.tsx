import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { HighlightInit } from '@highlight-run/next/client';
import { HIGHLIGHT_APP_KEY } from '@/lib/utils';
import Script from 'next/script';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
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
                  appId: "98c76023-329b-4653-88a8-ad26acf5b033",
                });
              });
            `}} />
            <title>Stock Games </title>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
          </head>
          <body
            className={`${poppins.className} antialiased`}
          >
            <NuqsAdapter>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </NuqsAdapter>

          </body>
        </html>
      </GoogleOAuthProvider>
    </>
  );
}
