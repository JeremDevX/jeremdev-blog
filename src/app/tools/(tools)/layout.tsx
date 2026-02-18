import TaxonomySidebarServer from "@/components/custom/TaxonomySidebar/TaxonomySidebarServer";
import Link from "next/link";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="tool">
      <TaxonomySidebarServer />
      <main className="tool__container article-padding">
        {children}
        <Link href="/tools" className="tool__back">
          View all tools
        </Link>
      </main>
    </div>
  );
}
