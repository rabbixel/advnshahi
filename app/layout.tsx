import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-wght-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const inter = localFont({
  src: [{ path: "./fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const gurmukhi = localFont({
  src: [{ path: "./fonts/noto-sans-gurmukhi-gurmukhi-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-gurmukhi-face",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: Nanakshahi Calendar, Gurpurab & Sikh Heritage`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "NanakShahi Editorial Team", url: `${siteConfig.url}/about` }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${inter.variable} ${gurmukhi.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
