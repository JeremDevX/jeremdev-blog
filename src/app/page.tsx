import { defineQuery, SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import ArticleCard from "@/components/custom/ArticleCard";

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
}

const options = { next: { revalidate: 60 } };

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, title, slug, date, resume, coverImage, "category" : Category->{title}}|order(date desc)[0...6]`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="flex gap-12 w-full max-w-screen-xl p-4 mt-20">
      <h1 className="text-4xl font-bold tracking-tighter text-center absolute top-24 left-1/2 transform -translate-x-1/2">
        JeremDevX - Blog
      </h1>
      <section className="flex-3">
        <h2 className="text-center text-3xl font-bold mb-12">
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
      <section className="flex-1 lg:block hidden">
        <h2 className="text-center font-semibold text-2xl mb-12">
          Test section
        </h2>
        <ul className="flex flex-col gap-10 text-center">
          <li className="line-clamp-1">Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
        </ul>
      </section>
    </main>
  );
}
