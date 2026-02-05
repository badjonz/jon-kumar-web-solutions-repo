import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jon Kumar Web Solutions",
  description:
    "Professional web development services in the Cayman Islands. Custom websites, modern designs, and reliable support for your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        {/* Skip link target - actual SkipLink component added in Epic 5 */}
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
