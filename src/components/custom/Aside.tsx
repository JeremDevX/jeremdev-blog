import { Category } from "@/app/categories/page";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import AsideContent from "./AsideContent";

const options = { next: { revalidate: 36000 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

export default async function Aside() {
  const fetchedCategories = await client.fetch(CATEGORIES_QUERY, {}, options);

  return (
    <aside className="h-screen fixed left-0 top-0 bottom-0  bg-accent-darker sidebar overflow-y-auto overflow-x-hidden hidden lg:block">
      <div className="w-full">
        {fetchedCategories.map((category: Category) => (
          <AsideContent key={category._id} category={category.title} />
        ))}
      </div>
    </aside>
  );
}
