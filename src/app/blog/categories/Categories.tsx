"use client";

import Link from "next/link";
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "../../page";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/custom/Button";

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;
const options = { next: { revalidate: 60 } };

const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"]`);

const PAGE_SIZE = 10;

export default function Categories() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categoryTitle, setCategoryTitle] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  const fetchCategories = async () => {
    const fetchedCategories = await client.fetch(CATEGORIES_QUERY, {}, options);
    setCategories(fetchedCategories);
    return fetchedCategories;
  };

  const fetchPosts = async (category: string, page: number) => {
    const categoryFilter =
      category !== "all" ? `&& Category->slug.current == "${category}"` : "";

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const POSTS_QUERY = defineQuery(`{
      "posts": *[
        _type == "post" && defined(slug.current) ${categoryFilter}
      ] | order(date desc) [${startIndex}...${endIndex}] {
        _id, title, slug, date, resume, coverImage, 
        "category" : Category->{title}
      },
      "total": count(*[
        _type == "post" && defined(slug.current) ${categoryFilter}
      ])
    }`);

    const { posts: fetchedPosts, total: fetchedTotalPosts } =
      await client.fetch(POSTS_QUERY, {}, options);

    setPosts(fetchedPosts);
    setTotalPosts(fetchedTotalPosts);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCategory = event.target.value;
    const newCategoryTitle = event.target.selectedOptions[0].text;
    setSelectedCategory(newCategory);
    setCategoryTitle(newCategoryTitle);
    setCurrentPage(1);
    router.replace(`/blog/categories?category=${newCategory}`);
  };

  useEffect(() => {
    const initializeCategories = async () => {
      const fetchedCategories = await fetchCategories();
      const searchParams = new URLSearchParams(window.location.search);
      const categoryParam = searchParams.get("category");

      if (categoryParam) {
        const categoryExists = fetchedCategories.find(
          (cat: Category) =>
            cat.title.toLowerCase() === categoryParam.toLowerCase()
        );
        if (categoryExists) {
          setSelectedCategory(categoryParam.toLowerCase());
          setCategoryTitle(categoryExists.title);
        } else {
          router.replace("/blog/categories?category=all");
        }
      }
    };

    initializeCategories();
  }, [router]);

  useEffect(() => {
    fetchPosts(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);

  return (
    <>
      <h1 className="w-full text-3xl xs:text-4xl font-bold tracking-tighter text-center absolute top-28 left-1/2 transform -translate-x-1/2">
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

      <section className="grid grid-cols-2 gap-12 w-full mt-12 mb-8">
        {posts.map((post: Post) => (
          <Card
            className="bg-card overflow-hidden col-span-2 sm:col-span-1 flex flex-col justify-between hover:drop-shadow-light hover:scale-101"
            key={post._id}
          >
            <CardHeader className={`p-4 relative`}>
              <div className="absolute inset-0 bg-gray-900 opacity-85 z-10"></div>
              <Image
                src={urlFor(post.coverImage)?.url() || ""}
                fill
                alt=""
                className="object-cover"
              />
              <Link
                href={`/blog/posts/${post?.slug?.current}`}
                className="hover:underline-offset-4 hover:underline z-10"
                tabIndex={-1}
              >
                <CardTitle className="text-xl font-bold h-14 line-clamp-2 z-10">
                  {post?.title}
                </CardTitle>
              </Link>
              <CardDescription className="flex justify-between items-end text-base text-card-foreground z-10">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span
                  className={`font-bold px-2 py-1 mt-2 rounded-lg text-xl cat-${post.category.title.toLowerCase()}`}
                >
                  {post?.category.title}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 my-4 h-28 overflow-hidden text-ellipsis line-clamp-4">
              <span>{post.resume}</span>
            </CardContent>
            <CardFooter className="flex justify-center p-4 -mt-2 w-full">
              <Button
                link={`/blog/posts/${post?.slug?.current}`}
                text="Read full article..."
                className="text-center w-96"
              />
            </CardFooter>
          </Card>
        ))}
      </section>
      <div className="flex justify-center items-center gap-4 mb-4">
        <Button
          text="&larr; Previous"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="disabled:opacity-50"
        />
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button
          text="Next &rarr;"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="disabled:opacity-50"
        />
      </div>
    </>
  );
}
