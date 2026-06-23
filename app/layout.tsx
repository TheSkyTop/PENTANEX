import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pentanex.com.au";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PentaNex | AI Data Centre & Digital Infrastructure Developer Australia",
    template: "%s | PentaNex",
  },
  description:
    "PentaNex develops large-scale AI-ready data centre campuses and digital infrastructure projects across Australia, supporting hyperscale cloud, GPU computing and next-generation digital services.",
  keywords: [
    "PentaNex",
    "AI Data Centre Australia",
    "Data Centre Developer Australia",
    "Hyperscale Data Centre",
    "Digital Infrastructure",
    "GPU Data Centre",
    "AI Infrastructure",
    "Cloud Infrastructure",
    "Data Centre Campus",
    "Digital Infrastructure Platform",
    "Data Centre Development",
    "AI Computing Infrastructure",
    "Energy Integrated Data Centre",
    "High Density Data Centre",
    "Liquid Cooling Data Centre",
    "Melbourne Data Centre",
    "Victoria Data Centre",
    "Melbourne North",
    "Australian digital infrastructure",
    "Hyperscale Campus Development",
  ],
  applicationName: "PentaNex",
  authors: [{ name: "PentaNex" }],
  creator: "PentaNex",
  publisher: "PentaNex",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PentaNex | AI Data Centre & Digital Infrastructure Developer Australia",
    description:
      "PentaNex develops large-scale AI-ready data centre campuses and digital infrastructure projects across Australia for hyperscale cloud, GPU computing and next-generation digital services.",
    url: siteUrl,
    siteName: "PentaNex",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: assetPath("/hyperscale-data-centre-melbourne.jpg"),
        width: 3000,
        height: 1688,
        alt: "Blue hyperscale data centre server hall background for PentaNex digital infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PentaNex | AI Data Centre & Digital Infrastructure Developer Australia",
    description:
      "PentaNex develops AI-ready data centre campuses and digital infrastructure projects across Australia.",
    images: [assetPath("/hyperscale-data-centre-melbourne.jpg")],
  },
  icons: {
    icon: [
      { url: assetPath("/favicon.svg"), type: "image/svg+xml" },
      { url: assetPath("/pentanex-mark.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: assetPath("/apple-touch-icon.png"),
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
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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



