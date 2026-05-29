import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://pentanex.com.au";

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
    "Craigieburn",
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
        url: "/pentanex-logo.png",
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
    images: ["/pentanex-logo.png"],
  },
  icons: {
    icon: "/pentanex-logo.png",
    apple: "/pentanex-logo.png",
  },
  manifest: "/site.webmanifest",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
