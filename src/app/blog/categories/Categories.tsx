"use client";

import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "../../page";
import type { SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";
import Button from "@/components/custom/Button";
import ArticleCard from "@/components/custom/ArticleCard";

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
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
const options = { next: { revalidate: 43200 } };

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
        "category" : Category->{title,slug}
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
      <h1 className="blog-cat__title">Category : {categoryTitle}</h1>
      <div className="blog-cat__select-container">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">All</option>
          {categories.map((category: Category) => (
            <option value={category.slug.current} key={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <section className="blog-cat__list">
        {posts.map((post: Post) => (
          <ArticleCard
            key={post._id}
            title={post.title}
            imgSrc={urlFor(post.coverImage)?.url() || ""}
            date={post.date}
            category={post.category.title}
            categorySlug={post.category.slug.current}
            resume={post.resume}
            slug={post.slug.current}
          />
        ))}
      </section>
      <div className="blog-cat__btns">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          &larr; Previous
        </Button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next &rarr;
        </Button>
      </div>
    </>
  );
}
