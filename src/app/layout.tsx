import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { company } from "@/data/factoryData";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Outfit({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = `${company.name} — Export Sweater Manufacturer, Dhaka, Bangladesh`;
const description =
  "100% export-oriented sweater factory in Ashulia, Dhaka: 300 automated jacquard knitting machines (14G–5/7G), 2M+ pcs yearly capacity, BSCI, SEDEX (SMETA) and OEKO-TEX Standard 100. Request a quotation or factory tour.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s | ${company.shortName}` },
  description,
  applicationName: company.name,
  keywords: [
    "sweater manufacturer Bangladesh",
    "knitwear factory Dhaka",
    "jacquard knitting",
    "export sweater factory",
    "BGMEA member",
    "BSCI sweater factory",
    "OEKO-TEX knitwear",
    "private label sweaters",
    "Ashulia knitwear",
  ],
  authors: [{ name: company.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.name,
    title,
    description,
    url: "/",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${company.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#021129",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
