import { Category } from "@/app/blog/categories/Categories";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import AsideBlogContent from "./AsideBlogContent";
import path from "path";
import fs from "fs";
import AsideToolsList from "./AsideToolsList";
import { ToolsCategory } from "@/app/tools/page";

interface AsideProps {
  asideFor: "tools" | "blog";
}

const options = { next: { revalidate: 86400 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

export default async function Aside(props: AsideProps) {
  const fetchedBlogCategories = await client.fetch(
    CATEGORIES_QUERY,
    {},
    options
  );

  const toolsFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "tools-list.json"
  );
  const toolsData = fs.readFileSync(toolsFilePath, "utf8");
  const fetchedToolsCategories = JSON.parse(toolsData).categories;

  return (
    <aside className="h-screen fixed left-0 top-0 bottom-0  bg-accent-darker border-r sidebar overflow-y-auto overflow-x-hidden hidden lg:block">
      {props.asideFor === "tools" && (
        <div className="w-full">
          {fetchedToolsCategories.map((toolName: ToolsCategory) => (
            <AsideToolsList key={toolName.name} category={toolName.name} />
          ))}
        </div>
      )}
      {props.asideFor === "blog" && (
        <div className="w-full">
          {fetchedBlogCategories.map((category: Category) => (
            <AsideBlogContent key={category._id} category={category.title} />
          ))}
        </div>
      )}
    </aside>
  );
}
