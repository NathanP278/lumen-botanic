import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMEN // BOTANICA — Sleek Living Botanical Formulations",
  description:
    "Hydraulically cold-pressed at 36°F. 15,000 PSI force. 100% active living enzymes in 4 precision formulations with interactive cellular nutrition metrics.",
  keywords: [
    "cold-pressed juice",
    "botanical formulation",
    "interactive nutrition",
    "cellular hydration",
    "raw living enzymes",
    "modern botanicals",
  ],
  openGraph: {
    title: "LUMEN // BOTANICA — Precision Living Botanicals",
    description: "Interactive 3D Cold-Pressed Formulations & Molecular Nutrition HUD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#09090b] text-[#fafafa] min-h-screen selection:bg-emerald-400 selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}
