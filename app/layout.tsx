import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Martian_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub For Every Dev Event You Mustn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <Navbar/>
        <div className="fixed inset-0 m-auto overflow-visible -z-1 min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#80ffd5"
            raysSpeed={0.5}
            lightSpread={1.2}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.03}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
