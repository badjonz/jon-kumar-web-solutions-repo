import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  CONTACT_EMAIL,
  getSiteUrl,
} from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Professional websites in Trinidad and Tobago`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Jon Kumar" }],
  creator: "Jon Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get site URL with production validation
  const siteUrl = getSiteUrl();

  // JSON-LD structured data for LocalBusiness schema
  const jsonLd: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    url: string;
    email: string;
    image: string;
    areaServed: {
      "@type": string;
      name: string;
    };
    serviceType: string;
    sameAs: string[];
  } = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    email: CONTACT_EMAIL,
    image: `${siteUrl}/og-image.png`,
    areaServed: {
      "@type": "Country",
      name: "Trinidad and Tobago",
    },
    serviceType: "Web Development",
    // TODO: Populate with social profile URLs (LinkedIn, GitHub, Twitter, etc.) when available
    sameAs: [],
  };

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        {/* Skip link target - actual SkipLink component added in Epic 5 */}
        <main id="main-content">{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
