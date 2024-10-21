import { Category } from "@/app/blog/categories/page";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import CategoryButton from "./CategoryButton";

const options = { next: { revalidate: 36000 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

export default async function CategoryList() {
  const fetchedCategories = await client.fetch(CATEGORIES_QUERY, {}, options);
  return (
    <div>
      <h2 className="text-center font-semibold text-2xl mb-6 border-b pb-3">
        Browse by category
      </h2>
      <div className="flex gap-4 flex-wrap">
        {fetchedCategories.map((category: Category) => (
          <CategoryButton
            key={category._id}
            catClass={category.slug.current}
            href={category.slug.current}
            growOnHover
          >
            {category.title}
          </CategoryButton>
        ))}
      </div>
    </div>
  );
}
