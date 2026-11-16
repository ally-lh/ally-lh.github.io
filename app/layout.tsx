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

const TITLE = "Allison Loo | Creative Software Engineer";
const DESCRIPTION =
  "Allison Loo is a creative software engineer. Her portfolio is an interactive pixel-art shooting range where you can browse her projects.";

/** Share images and icons come from the app/ file conventions (opengraph-image, icon, apple-icon). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Allison Loo Portfolio",
  authors: [{ name: "Allison Loo", url: SITE.url }],
  creator: "Allison Loo",
  keywords: [
    "Allison Loo",
    "creative software engineer",
    "portfolio",
    "web developer",
    "frontend developer",
    "Singapore",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Allison Loo",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
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
