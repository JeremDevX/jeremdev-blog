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
      <main id="main-content" tabIndex={-1} className="post article-padding">
        {children}
      </main>
    </>
  );
}
