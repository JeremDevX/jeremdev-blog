import { Metadata } from "next";
import { getToolsByCategory } from "@/lib/tools";
import CategoryGroup from "@/components/custom/CategoryGroup";
import styles from "./ToolsIndex.module.scss";

export const metadata: Metadata = {
  title: "Developer Tools",
  description:
    "Browse all developer tools organized by category — CSS generators, accessibility checkers, and more.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Developer Tools",
    description:
      "Browse all developer tools organized by category — CSS generators, accessibility checkers, and more.",
    type: "website",
  },
};

export default function ToolsPage() {
  const categories = getToolsByCategory();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Developer Tools</h1>
      {categories.map((category) => (
        <CategoryGroup key={category.name} category={category} />
      ))}
    </main>
  );
}
