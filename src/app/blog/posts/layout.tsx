import type { Metadata } from "next";
import "../../globals.css";
import Aside from "@/components/custom/Aside";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full">
      <Aside />
      <main className="flex h-screen justify-end article-padding">
        {children}
      </main>
    </div>
  );
}
