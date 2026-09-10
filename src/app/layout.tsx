import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "LUMEN Botanic | Haute Cold-Pressed Botanicals & Living Elixirs",
  description:
    "Cold-extracted at 36°F under 15,000 lbs of hydraulic force. Single-origin biodynamic organic botanicals formulated for cellular energy and radiant vitality.",
  keywords: [
    "cold-pressed juice",
    "luxury botanicals",
    "living enzymes",
    "biodynamic juice",
    "hydraulic press",
    "cleanse ritual",
    "alkaline elixir",
  ],
  openGraph: {
    title: "LUMEN Botanic | Haute Cold-Pressed Botanicals",
    description:
      "15,000 lbs hydraulic cold-press force. 0g synthetic additives. 100% active living phytonutrients.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#08130E] text-[#FAF7F2] min-h-screen selection:bg-botanic-gold selection:text-botanic-dark">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
