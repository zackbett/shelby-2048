import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Shelby 2048",
  description: "Play 2048 with a Shelby-powered global leaderboard.",
  
  icons: {
    icon: "/shelby-2048.png",
  },

  openGraph: {
    title: "Shelby 2048",
    description: "Play 2048 with a Shelby-powered global leaderboard.",
    url: "https://shelby-2048.vercel.app",
    siteName: "Shelby 2048",
    images: [
      {
        url: "/shelby-2048.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shelby 2048",
    description: "Play 2048 with a Shelby-powered global leaderboard.",
    images: ["/shelby-2048.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
