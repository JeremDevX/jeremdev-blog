import { defineQuery, SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import ArticleCard from "@/components/custom/ArticleCard";
import MostViewedPosts from "@/components/custom/MostViewedPosts";
import CategoryList from "@/components/custom/CategoryList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Blog",
  description:
    " Discover the latest or most viewed articles on TechHowlerX's blog.",
  keywords: "tech, programming, blog",
};

export interface Post extends SanityDocument {
  title: string;
  coverImage: {
    asset: {
      _ref: SanityImageSource;
    };
  };
  slug: {
    current: string;
  };
  date: Date;
  resume: string;
  category: {
    title: string;
    slug: {
      current: string;
    };
  };
  view: number;
}

const options = { next: { revalidate: 30 } };

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, title, slug, date, resume, coverImage, "category" : Category->{title,slug}}|order(date desc)[0...5]`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="blog">
      <h1 className="blog__main-title">Blog</h1>
      <section className="blog__latest">
        <h2 className="blog__latest-title">Latest articles</h2>
        <div className="blog__latest-articles">
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
        </div>
      </section>
      <section className="blog__most-viewed">
        <MostViewedPosts />
        <CategoryList />
      </section>
    </main>
  );
}
