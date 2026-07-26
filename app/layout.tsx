import type { Metadata, Viewport } from "next";
import { Alfa_Slab_One, Montserrat } from "next/font/google";
import "./globals.css";

const alfa = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alfa",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cairn",
  description: "A calm place to keep your commitments — for Eagle Lake staff.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c1a17",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${alfa.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
