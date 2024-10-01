import Link from "next/link";
import { defineQuery, SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
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
import { Input } from "@/components/ui/input";

interface Post extends SanityDocument {
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
}

const options = { next: { revalidate: 60 } };

const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]{_id, title, slug, date, resume, category}|order(date desc)`);

export default async function IndexPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="flex min-h-screen gap-12 w-full max-w-screen-xl p-4">
      <section className="grid grid-cols-2 gap-12 flex-3">
        <h2 className="col-span-2 text-center text-3xl font-bold">
          Latest articles
        </h2>
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
                  className={`font-bold p-2 rounded-lg bg-${post.category.toLowerCase()}`}
                >
                  {post?.category}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 h-28 overflow-hidden text-ellipsis line-clamp-4">
              <span>{post.resume}</span>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <Link href={`/posts/${post?.slug?.current}`} className="w-full">
                <button className="min-fit w-full px-4 py-2 bg-secondary hover:text-primary-foreground hover:bg-primary transition-colors rounded-lg">
                  Read More
                </button>
              </Link>
            </CardFooter>
          </Card>
        ))}
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
