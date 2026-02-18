import type { Metadata } from "next";
import Script from "next/script";
import { Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "OC-DASHBOARD",
  description: "Ocean Campus Dashboard",
};

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
});

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
      <body
        className={`${firaSans.variable} ${firaCode.variable} min-h-screen bg-[var(--ds-bg)] text-[var(--ds-text)] font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
