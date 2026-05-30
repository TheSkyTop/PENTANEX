import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pentanex.com.au";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PENTANEX | AI-ready Australian Data Centre Infrastructure",
    template: "%s | PENTANEX",
  },
  description:
    "PENTANEX is developing AI-ready digital infrastructure for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand in Australia.",
  keywords: [
    "PENTANEX",
    "data centre",
    "AI infrastructure",
    "hyperscale campus",
    "Melbourne North",
    "Australian digital infrastructure",
  ],
  applicationName: "PENTANEX",
  authors: [{ name: "PENTANEX" }],
  creator: "PENTANEX",
  publisher: "PENTANEX",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PENTANEX | AI-ready Australian Data Centre Infrastructure",
    description:
      "AI-ready digital infrastructure planned for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand.",
    url: siteUrl,
    siteName: "PENTANEX",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "pentanex-logo.png",
        width: 512,
        height: 512,
        alt: "PENTANEX logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PENTANEX | AI-ready Australian Data Centre Infrastructure",
    description:
      "AI-ready digital infrastructure planned for hyperscale cloud, accelerated compute, enterprise AI, and sovereign workload demand.",
    images: ["pentanex-logo.png"],
  },
  icons: {
    icon: [
      { url: assetPath("/favicon.svg"), type: "image/svg+xml" },
      { url: assetPath("/pentanex-logo.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: assetPath("/pentanex-logo.png"),
  },
  manifest: assetPath("/site.webmanifest"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
