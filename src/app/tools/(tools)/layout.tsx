import TaxonomySidebarServer from "@/components/custom/TaxonomySidebar/TaxonomySidebarServer";
import Link from "next/link";
import styles from "./layout.module.scss";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.root}>
      <aside className={styles.sidebar} aria-label="Taxonomy sidebar">
        <TaxonomySidebarServer />
      </aside>
      <main className={`${styles.main} article-padding`}>
        {children}
        <Link href="/tools" className={styles.backLink}>
          View all tools
        </Link>
      </main>
    </div>
  );
}
