import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { CallBackWidget } from "@/components/CallBackWidget";
import { ChatBot } from "@/components/ChatBot";

const poppins = Poppins({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.doctor.name}, ${siteConfig.location}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Sitara Holistic Care",
    "Sri Sitara Hospital Tanuku",
    "diabetes doctor Tanuku",
    "internal medicine physician",
    "Dr Neelu Mahendra",
    "book consultation Tanuku",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background bg-mesh text-slate-900">
        <TopBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <CallBackWidget />
        <ChatBot />
      </body>
    </html>
  );
}
