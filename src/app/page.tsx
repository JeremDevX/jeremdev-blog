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
]{_id, title, slug, date, coverImage, category}|order(date desc)`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="flex min-h-screen gap-12 w-full max-w-screen-xl p-4">
      <section className="grid grid-cols-* gap-12 flex-2">
        <h2 className="col-span-2 text-center text-3xl font-bold">
          Latest articles
        </h2>
        {posts.map((post: Post) => (
          <Card
            className="bg-card overflow-hidden group col-span-2 sm:col-span-1"
            key={post._id}
          >
            <CardHeader className="bg-gradient p-4">
              <CardTitle className="text-xl font-bold">{post?.title}</CardTitle>
              <CardDescription className="flex justify-between text-card-foreground">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="">Category: {post?.category} </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Image
                src={urlFor(post.coverImage.asset._ref)?.url() || ""}
                width={100}
                height={100}
                alt=""
              />
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <button className="min-fit w-full px-4 py-2 bg-secondary hover:text-primary-foreground hover:bg-primary transition-colors rounded-lg">
                <Link href={`/posts/${post?.slug?.current}`}>Read More</Link>
              </button>
            </CardFooter>
          </Card>
        ))}
      </section>
      <section className="flex-1 lg:block hidden">
        Test section
        <ul className="flex flex-col gap-10 text-center">
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
          <li>Sample text sample text sample text</li>
        </ul>
      </section>
    </main>
  );
}
