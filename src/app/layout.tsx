import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WalletProvider from "@/components/WalletProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Guestbook",
    template: "%s · Guestbook",
  },
  description:
    "A decentralized guestbook on Solana devnet. Connect your wallet and leave a permanent on-chain message.",
  keywords: ["Solana", "guestbook", "web3", "on-chain", "devnet", "blockchain"],
  authors: [{ name: "Guestbook" }],
  openGraph: {
    type: "website",
    title: "Guestbook",
    description:
      "A decentralized guestbook on Solana devnet. Connect your wallet and leave a permanent on-chain message.",
    siteName: "Guestbook",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guestbook",
    description:
      "A decentralized guestbook on Solana devnet. Connect your wallet and leave a permanent on-chain message.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">
          <WalletProvider>{children}</WalletProvider>
        </body>
    </html>
  );
}
