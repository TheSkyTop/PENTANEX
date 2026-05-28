import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PENTANEX | AI-ready Australian Data Centre Infrastructure",
  description:
    "PENTANEX develops AI-ready digital infrastructure for Australia's next era of compute, led by the 980 Hume Freeway 560MW campus.",
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
