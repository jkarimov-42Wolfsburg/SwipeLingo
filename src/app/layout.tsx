import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TelegramProvider } from "@/lib/telegram/TelegramProvider";
import { BottomNav } from "@/components/ui/BottomNav";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Telegram Mini App",
  description: "A Telegram Mini App for connecting with teachers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TelegramProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <BottomNav />
        </TelegramProvider>
      </body>
    </html>
  );
}
