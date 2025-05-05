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
  title: "Baliz Parmak Topluluğu",
  description: "Baliz Parmak Topluluğu Resmi Web Sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <title>Baliz Parmak Topluluğu</title>
        <meta name="description" content="Baliz Parmak Topluluğu Resmi Web Sitesi" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/baliz.jpg" />
        <link rel="apple-touch-icon" href="/baliz.jpg" />
        <meta property="og:image" content="/baliz.jpg" />
        <meta name="twitter:image" content="/baliz.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
