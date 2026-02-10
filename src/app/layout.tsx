import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "OC-DASHBOARD",
  description: "Ocean Campus Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B1BYG2G8EC"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B1BYG2G8EC');
          `}
        </Script>
      </head>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
