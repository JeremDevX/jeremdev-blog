import { Category } from "@/app/blog/categories/Categories";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import CategoryButton from "./CategoryButton";

const options = { next: { revalidate: 30 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

export default async function CategoryList() {
  const fetchedCategories = await client.fetch(CATEGORIES_QUERY, {}, options);
  return (
    <div className="cat-list">
      <h2 className="cat-list__title">Browse by category</h2>
      <div className="cat-list__container">
        <CategoryButton href="/blog/categories" catClass="all" growOnHover link>
          All
        </CategoryButton>

        {fetchedCategories.map((category: Category) => (
          <CategoryButton
            key={category._id}
            catClass={category.slug.current}
            href={category.slug.current}
            growOnHover
            link
          >
            {category.title}
          </CategoryButton>
        ))}
      </div>
    </div>
  );
}
