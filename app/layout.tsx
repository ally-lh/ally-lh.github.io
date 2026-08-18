import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content/site";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.playerName} — ${SITE.role}`,
  description: `${SITE.tagline} An interactive game-style portfolio.`,
};

/** Game-style page: lock pinch/double-tap zoom so shots register cleanly. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body className="cursor-hidden antialiased">{children}</body>
    </html>
  );
}
