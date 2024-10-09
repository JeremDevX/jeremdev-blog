"use client";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect, Suspense } from "react";
import { Post } from "../page";

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

const options = { next: { revalidate: 60 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

function CategoriesContent() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categoryTitle, setCategoryTitle] = useState<string>("All");

  const fetchCategories = async () => {
    const fetchedCategories = await client.fetch(CATEGORIES_QUERY, {}, options);
    setCategories(fetchedCategories);
    return fetchedCategories;
  };

  const fetchPosts = async (category: string) => {
    const categoryFilter =
      category !== "all" ? `&& Category->slug.current == "${category}"` : "";
    const POSTS_QUERY = defineQuery(`*[
      _type == "post" && defined(slug.current) ${categoryFilter}
    ]{_id, title, slug, date, resume, "category" : Category->{title}}|order(date desc)`);

    const fetchedPosts = await client.fetch(POSTS_QUERY, {}, options);
    setPosts(fetchedPosts);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event);
    const newCategory = event.target.value;
    const newCategoryTitle = event.target.selectedOptions[0].text;
    setSelectedCategory(newCategory);
    setCategoryTitle(newCategoryTitle);
    router.replace(`/categories?category=${newCategory}`);
  };

  useEffect(() => {
    const initializeCategories = async () => {
      const fetchedCategories = await fetchCategories();
      const searchParams = new URLSearchParams(window.location.search);
      const categoryParam = searchParams.get("category");

      if (categoryParam) {
        const categoryExists = fetchedCategories.some(
          (cat: Category) =>
            cat.title.toLowerCase() === categoryParam.toLowerCase()
        );
        if (categoryExists) {
          setSelectedCategory(categoryParam.toLowerCase());
        } else {
          router.replace("/categories?category=all");
        }
      }
    };

    initializeCategories();
  }, [router]);

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tighter text-center absolute top-24 left-1/2 transform -translate-x-1/2">
        Category : {categoryTitle}
      </h1>
      <div className="flex justify-end w-full">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 bg-secondary rounded-lg"
        >
          <option value="all">All</option>
          {categories.map((category: Category) => (
            <option value={category.slug.current} key={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <section className="grid grid-cols-2 grid-rows-4 gap-12 w-full mt-12">
        {posts.map((post: Post) => (
          <Card
            className="bg-card overflow-hidden col-span-2 sm:col-span-1 flex flex-col justify-between"
            key={post._id}
          >
            <CardHeader className="bg-secondary p-4">
              <CardTitle className="text-xl font-bold h-14 line-clamp-2">
                {post?.title}
              </CardTitle>
              <CardDescription className="flex justify-between items-end text-card-foreground">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span
                  className={`font-bold p-2 rounded-lg cat-${post.category.title.toLowerCase()}`}
                >
                  {post?.category.title}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 h-28 overflow-hidden text-ellipsis line-clamp-4">
              <span>{post.resume}</span>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <Link href={`/posts/${post?.slug?.current}`} className="w-full">
                <button className="min-fit w-full px-4 py-2 bg-secondary font-semibold hover:text-primary-foreground hover:bg-primary transition-colors rounded-lg">
                  Read full post...
                </button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex flex-col min-h-screen gap-12 w-full max-w-screen-xl p-4 mt-20">
        <CategoriesContent />
      </main>
    </Suspense>
  );
}
