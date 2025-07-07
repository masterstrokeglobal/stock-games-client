import { HIGHLIGHT_APP_KEY } from '@/lib/utils';
import { HighlightInit } from '@highlight-run/next/client';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from "next-intl/server";
import { Inter, Jersey_10, Jersey_20, Konkhmer_Sleokchher, Montserrat, Phudu, Play, Playfair_Display_SC, Poppins, Protest_Strike, Russo_One} from 'next/font/google';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import "./globals.css";
import "./game.css"
import "./shuffle.css";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const KonkhmerSleokchher = Konkhmer_Sleokchher({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-konkhmer-sleokchher',
});


const jersy2 = Jersey_20 ({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-jersy-20',
});

const jersy10 = Jersey_10({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-jersy-10',
});

const RussoOne = Russo_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-russo-one',
});

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfairDisplaySC = Playfair_Display_SC({
  weight: ['400',"700"],
  subsets: ['latin'],
  variable: '--font-playfair-display-sc',
});

const play = Play({
  weight: ['400', "700"],
  subsets: ['latin'],
  variable: '--font-play',
});

const phudu = Phudu({
  weight: ['300', "400", "500", "600", "700"],
  subsets: ['latin'],
  variable: '--font-phudu',
});


const protestStrike = Protest_Strike({    
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-protest-strike',
});

import {
  FpjsProvider
} from '@fingerprintjs/fingerprintjs-pro-react';


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
            <body
              className={`${poppins.className} antialiased ${KonkhmerSleokchher.variable} ${jersy2.variable} ${jersy10.variable} ${RussoOne.variable} ${montserrat.variable} ${inter.variable} ${playfairDisplaySC.variable} ${play.variable} ${phudu.variable} ${protestStrike.variable}`}
            >
              <NuqsAdapter>
                <NextIntlClientProvider messages={messages}>
                  {children}
                </NextIntlClientProvider>
              </NuqsAdapter>

            </body>
          </html> 
        </GoogleOAuthProvider>
      </FpjsProvider>
    </>
  );
}
