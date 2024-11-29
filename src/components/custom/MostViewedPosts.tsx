import { Post } from "@/app/page";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const options = { next: { revalidate: 86400 } };

const POSTS_QUERY = defineQuery(`*[
    _type == "post"
    && defined(slug.current)
  ]{_id, title, slug, view}|order(view desc)[0...5]`);

export default async function MostViewedPosts() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);
  return (
    <>
      <div className="mv-posts">
        <h2 className="mv-posts__title">Most viewed articles</h2>
        {posts.map((post: Post) => (
          <Link
            href={`/blog/posts/${post?.slug?.current}`}
            key={post._id}
            className="mv-posts__link"
          >
            <h3 className="mv-posts__post-title">{post.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
