import { Post } from "@/app/page";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const options = { next: { revalidate: 60 } };

const POSTS_QUERY = defineQuery(`*[
    _type == "post"
    && defined(slug.current)
  ]{_id, title, slug, view}|order(view desc)[0...5]`);

export default async function MostViewedPosts() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);
  return (
    <>
      <h2 className="text-center font-semibold text-2xl mb-10 border-b pb-3">
        Most viewed articles
      </h2>
      <div className="flex flex-col gap-4">
        {posts.map((post: Post) => (
          <Link href={`/posts/${post?.slug?.current}`} key={post._id}>
            <h3 className="font-semibold hover:underline underline-offset-4 hover:text-primary line-clamp-2">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </>
  );
}
