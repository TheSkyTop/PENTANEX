import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oceanenergy.au";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;
const isEverestBuild = process.env.NEXT_PUBLIC_SITE_VARIANT === "everest";
const siteRoot = basePath ? `${basePath}/` : "/";
const absoluteAsset = (path: string) => new URL(assetPath(path), siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: isEverestBuild ? "Everest Foam" : "OceanEnergy | Australia Energy Insights",
    template: isEverestBuild ? "%s | Everest Foam" : "%s | OceanEnergy",
  },
  description:
    isEverestBuild
      ? "Everest Foam is establishing an Australian foam manufacturing platform in Derrimut, Victoria for bedding, furniture, EPS, filtration, medical and automotive applications."
      : "OceanEnergy provides expert Australian energy market intelligence across NEM, WEM, gas, policy, commercial contracts, technology and investment signals.",
  keywords: isEverestBuild
    ? ["Everest Foam", "foam manufacturing", "Derrimut", "Victoria", "bedding foam", "EPS", "industrial filtration foam"]
    : ["OceanEnergy", "Australia energy", "NEM", "WEM", "gas market", "AEMO", "energy market intelligence"],
  applicationName: isEverestBuild ? "Everest Foam" : "OceanEnergy",
  authors: [{ name: isEverestBuild ? "Everest Foam" : "OceanEnergy" }],
  creator: isEverestBuild ? "Everest Foam" : "OceanEnergy",
  publisher: isEverestBuild ? "Everest Foam" : "OceanEnergy",
  alternates: {
    canonical: siteRoot,
  },
  openGraph: {
    title: isEverestBuild ? "Everest Foam" : "OceanEnergy | Australia Energy Insights",
    description: isEverestBuild
      ? "Australian foam manufacturing platform in Derrimut, Victoria."
      : "Expert Australian energy market intelligence across electricity, WEM, gas and commercial risk.",
    url: `${siteUrl}${siteRoot}`,
    siteName: isEverestBuild ? "Everest Foam" : "OceanEnergy",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: absoluteAsset(isEverestBuild ? "/everest-favicon.svg" : "/oceanenergy-logo.svg"),
        width: 64,
        height: 64,
        alt: isEverestBuild ? "Everest Foam logo" : "OceanEnergy OE logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: isEverestBuild ? "Everest Foam" : "OceanEnergy | Australia Energy Insights",
    description: isEverestBuild
      ? "Australian foam manufacturing platform in Derrimut, Victoria."
      : "Expert Australian energy market intelligence across electricity, WEM, gas and commercial risk.",
    images: [absoluteAsset(isEverestBuild ? "/everest-favicon.svg" : "/oceanenergy-logo.svg")],
  },
  icons: {
    icon: [{ url: assetPath(isEverestBuild ? "/everest-favicon.svg" : "/favicon.svg"), type: "image/svg+xml" }],
    apple: assetPath(isEverestBuild ? "/everest-favicon.svg" : "/oceanenergy-logo.svg"),
  },
  manifest: isEverestBuild ? undefined : assetPath("/site.webmanifest"),
  robots: {
    index: true,
    follow: true,
  },
  category: isEverestBuild ? "foam manufacturing" : "energy market intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var isEverest = ${isEverestBuild ? "true" : "false"} || window.location.port === "3001" || /everest/i.test(window.location.hostname);
  if (!isEverest) return;

  function applyEverestBranding() {
    document.title = "Everest Foam";

    var href = "${assetPath("/everest-favicon.svg")}";
    document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(function (link) {
      link.parentNode && link.parentNode.removeChild(link);
    });

    var link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = href;
    link.setAttribute("data-everest-brand", "true");
    document.head.appendChild(link);
  }

  applyEverestBranding();
  window.addEventListener("DOMContentLoaded", applyEverestBranding);
  var observer = new MutationObserver(function () {
    var icons = document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    var needsUpdate = document.title !== "Everest Foam" || icons.length !== 1 || icons[0].getAttribute("href") !== href;
    if (needsUpdate) applyEverestBranding();
  });
  observer.observe(document.head, { childList: true, subtree: true });
  window.setTimeout(applyEverestBranding, 300);
  window.setTimeout(applyEverestBranding, 1000);
  window.setTimeout(function () { observer.disconnect(); applyEverestBranding(); }, 3000);
})();
            `,
          }}
        />
      </body>
    </html>
  );
}
