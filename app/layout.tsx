import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";

export const metadata: Metadata = {
  title: "WhereWeWork — See your team on a globe",
  description:
    "A Slack app that shows your distributed team on an interactive 3D globe. See who's online, find meeting times across time zones, and stay connected.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "WhereWeWork — See your team on a globe",
    description:
      "A Slack app that shows your distributed team on an interactive 3D globe. Find meeting times, see who's online, and feel connected across time zones.",
    url: appUrl,
    siteName: "WhereWeWork",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhereWeWork — See your team on a globe",
    description:
      "A Slack app that shows your distributed team on an interactive 3D globe. Find meeting times across time zones.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="h-full min-h-full flex flex-col">{children}</body>
    </html>
  );
}
