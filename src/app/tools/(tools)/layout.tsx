import type { Metadata } from "next";
import "../../globals.css";
import Aside from "@/components/custom/Aside";
import Link from "next/link";
import ArrowTopOfPage from "@/components/custom/ArrowTopOfPage";

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
    <div className="w-full">
      <Aside asideFor="tools" />
      <main className="flex flex-col justify-center article-padding mb-8">
        <Link
          href="/tools"
          className="font-semibold underline-offset-4 hover:underline mb-8 w-fit ml-4 lg:ml-0 mt-4 lg:mt-0"
        >
          ← Back to tools
        </Link>
        {children}
        <div className="flex w-full justify-end mt-4">
          <ArrowTopOfPage />
        </div>
      </main>
    </div>
  );
}
