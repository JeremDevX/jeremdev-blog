import { getAllArticles } from "@/lib/content";
import { getAllTools } from "@/lib/tools";
import TaxonomySidebar from "./TaxonomySidebar";
import TaxonomySidebarMobile from "./TaxonomySidebarMobile";

export default async function TaxonomySidebarServer() {
  const articles = await getAllArticles();
  const tools = getAllTools();

  return (
    <>
      <TaxonomySidebarMobile articles={articles} tools={tools} />
      <TaxonomySidebar articles={articles} tools={tools} />
    </>
  );
}
