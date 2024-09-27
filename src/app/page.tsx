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
    <main className="flex bg-black-100 min-h-screen flex-col p-24 gap-12">
      <h1 className="text-4xl font-bold tracking-tighter">Posts</h1>
      <Input
        type="search"
        placeholder="Search articles..."
        className="pl-10 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
      />
      <ul className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {posts.map((post: Post) => (
          <Card className="bg-card overflow-hidden group" key={post._id}>
            <CardHeader className="bg-gradient p-4">
              <CardTitle className="text-xl font-bold">{post?.title}</CardTitle>
              <CardDescription className="text-gray-200">
                {new Date(post.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="">Category: {post?.category} </p>
              <Image
                src={urlFor(post.coverImage.asset._ref)?.url() || ""}
                width={100}
                height={100}
                alt=""
              />
            </CardContent>
            <CardFooter className="p-4 bg-accent">
              <button className="w-1/2 bg-secondary hover:text-primary-foreground hover:bg-primary transition-colors">
                <Link href={`/posts/${post?.slug?.current}`}>Read More</Link>
              </button>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </main>
  );
}
