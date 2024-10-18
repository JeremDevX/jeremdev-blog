import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${leagueSpartan.className} antialiased flex items-center flex-col min-h-screen text-xl tracking-tight`}
      >
        <header className="mb-20">
          <Navbar />
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
