import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "Brandon Kelly — Full Stack Developer",
  description: "Full stack developer specializing in JavaScript, TypeScript, React, Node.js, and CLI tooling. 1.3k+ npm downloads.",
  metadataBase: new URL("https://www.weballtech.com"),
  openGraph: {
    title: "Brandon Kelly — Full Stack Developer",
    description: "Full stack developer specializing in JavaScript, TypeScript, React, Node.js, and CLI tooling. 1.3k+ npm downloads.",
    url: "https://www.weballtech.com",
    siteName: "Brandon Kelly",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Brandon Kelly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandon Kelly — Full Stack Developer",
    description: "Full stack developer specializing in JavaScript, TypeScript, React, Node.js, and CLI tooling. 1.3k+ npm downloads.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
