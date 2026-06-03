import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

// We use Inter for that clean, Apple-like typography
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIKARSAUTO | Next-Gen AI Car Marketplace",
  description: "Buy and sell cars with confidence using AI-verified pricing and smart recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Navbar />
        {/* The 'children' prop renders whatever page the user is currently on */}
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}