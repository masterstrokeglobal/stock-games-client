import { HighlightInit } from '@highlight-run/next/client';
import { NextIntlClientProvider } from 'next-intl';
import { Poppins } from 'next/font/google';
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';


import { HIGHLIGHT_APP_KEY } from '@/lib/utils';
import { getLocale, getMessages } from "next-intl/server";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Include all weights
  subsets: ['latin'],  // Optional, but typically used for basic character sets
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
      <HighlightInit
        projectId={HIGHLIGHT_APP_KEY}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}>

      <html lang={locale}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Stock </title>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
        </head>
        <body
          className={`${poppins.className} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>

        </body>
      </html>
      </GoogleOAuthProvider>
    </>
  );
}
