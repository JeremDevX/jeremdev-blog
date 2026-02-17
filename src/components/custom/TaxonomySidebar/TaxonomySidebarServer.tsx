import { getAllArticles } from "@/lib/content";
import { getAllTools } from "@/lib/tools";
import TaxonomySidebar from "./TaxonomySidebar";

export default async function TaxonomySidebarServer() {
  const [articles, tools] = await Promise.all([
    getAllArticles(),
    Promise.resolve(getAllTools()),
  ]);

  return <TaxonomySidebar articles={articles} tools={tools} />;
}
