import TaxonomySidebarServer from "@/components/custom/TaxonomySidebar/TaxonomySidebarServer";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <aside aria-label="Taxonomy sidebar">
        <TaxonomySidebarServer />
      </aside>
      <main className="post article-padding">{children}</main>
    </>
  );
}
