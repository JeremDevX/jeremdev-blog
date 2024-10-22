import { defineQuery, SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import ArticleCard from "@/components/custom/ArticleCard";
import MostViewedPosts from "@/components/custom/MostViewedPosts";
import CategoryList from "@/components/custom/CategoryList";

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
  };
  view: number;
}

const options = { next: { revalidate: 60 } };

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, title, slug, date, resume, coverImage, "category" : Category->{title}}|order(date desc)[0...5]`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="flex gap-12 w-full max-w-screen-xl p-4 mt-24 mb-8">
      <h1 className="text-4xl font-bold tracking-tighter text-center absolute top-28 left-1/2 transform -translate-x-1/2">
        Blog
      </h1>
      <section className="flex-3 sm:px-6">
        <h2 className="text-center text-3xl font-bold mb-12 border-b border-secondary pb-2">
          Latest articles
        </h2>
        <div className="grid grid-cols-2 grid-rows-3 gap-8">
          {posts.map((post: Post) => (
            <ArticleCard
              key={post._id}
              title={post.title}
              imgSrc={urlFor(post.coverImage)?.url() || ""}
              date={post.date}
              category={post.category.title}
              resume={post.resume}
              slug={post.slug.current}
            />
          ))}
        </div>
      </section>
      <section className="flex-col flex-1 lg:flex hidden gap-8">
        <MostViewedPosts />
        <CategoryList />
      </section>
    </main>
  );
}
