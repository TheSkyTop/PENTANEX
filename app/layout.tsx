import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PENTANEX | AI-ready Australian Data Centre Infrastructure",
  description:
    "PENTANEX is planning AI-ready data centre capacity in Australia, led by the 980 Hume Freeway, Craigieburn VIC 3064 560MW campus capacity envelope.",
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
