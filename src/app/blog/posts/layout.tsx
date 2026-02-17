import TaxonomySidebarServer from "@/components/custom/TaxonomySidebar/TaxonomySidebarServer";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TaxonomySidebarServer />
      <main className="post article-padding">{children}</main>
    </>
  );
}
