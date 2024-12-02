import { League_Spartan } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import "../styles/main.scss";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`body ${leagueSpartan.className}`}>
        <header className="header">
          <Navbar />
        </header>
        {children}
        <Footer />
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
