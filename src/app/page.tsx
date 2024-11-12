import { defineQuery, SanityDocument } from "next-sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Button from "@/components/custom/Button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import HomeNews from "@/components/custom/HomeNews";
import HomeArticles from "@/components/custom/HomeArticles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Tech Blog & Dev Tools",
  description:
    "TechHowlerX is two parts website, one part blog and one part utility tools. Discover weekly posts about tech, programming and more or browse a wide range of tools like formatters, CSS utilities, and more.",
  keywords: "tech, programming, blog, dev tools, utility tools",
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
const options = { next: { revalidate: 86400 } };

const HOME_QUERY = defineQuery(`{
  "posts": *[
    _type == "post"
    && defined(slug.current)
  ]{
    _id, title, slug, coverImage, resume, view
  }|order(view desc)[0...1],

  "latestPost": *[
    _type == "post"
    && defined(slug.current)
]{_id, title,date, slug, coverImage, resume, view}|order(date desc)[0...1],

  "news": *[
    _type == "news"
  ]{
    _id, title, date, content
  }|order(date desc)[0...3]
}`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const homeContent = await client.fetch(HOME_QUERY, {}, options);
  return (
    <main className="flex flex-col w-full">
      <section className="flex justify-center text-accent-foreground pb-8 border-b border-card">
        <div className="max-w-1440 w-full flex flex-col p-4 justify-center items-center">
          <h1 className="text-4xl font-bold mt-8 mb-12 text-center w-fit flex flex-col md:flex-row">
            TechHowlerX -
            <span className="ml-0 md:ml-2">Tech Blog &amp; Dev Tools</span>
          </h1>
          <div className="flex items-center justify-center w-full h-full relative drop-shadow-light">
            <div className="relative justify-center items-center min-h-650 w-full flex">
              <Image
                src="/home-hero-image.png"
                // height={750}
                // width={1500}
                fill
                alt=""
                className="rounded-lg min-h-650 max-h-650 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center items-center text-center w-full h-full absolute inset-0 px-6 bg-gray-950 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80">
              <div className="flex flex-1 flex-col items-center justify-center gap-3 xs:gap-6 border-b border-secondary">
                <h2 className="text-2xl xs:text-3xl font-bold">
                  Weekly Tech and Programming Insights
                </h2>
                <p className="text-lg xs:text-xl font-normal">
                  Discover fresh content each week, covering topics from
                  software and hardware to everything in between.
                </p>
                <div className="flex flex-col gap-4 xs:flex-row xs:gap-8 justify-center items-center md:-mb-12">
                  <Button
                    text="Explore blog"
                    link="/blog"
                    ariaLabel="Explore Blog"
                  />
                  <Button
                    text="Blog Categories"
                    link="/blog/categories"
                    ariaLabel="Blog Categories"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-3 xs:gap-6">
                <h2 className="text-2xl xs:text-3xl font-bold md:-mt-12">
                  Free and Interactive Developer Tools
                </h2>
                <p className="text-lg xs:text-xl font-normal">
                  Explore a range of tools for design & accessibility, CSS
                  styling, development utilities, and text content optimization.
                </p>
                <div className="flex justify-center">
                  <Button
                    text="Explore tools"
                    link="/tools"
                    ariaLabel="Explore tools"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center gap-4 pb-8 border-b border-card">
        <HomeArticles
          latestPost={homeContent.latestPost}
          mostViewedPost={homeContent.posts}
          imgUrlLatest={
            urlFor(homeContent.latestPost[0].coverImage)?.url() || ""
          }
          imgUrlMostViewed={
            urlFor(homeContent.posts[0].coverImage)?.url() || ""
          }
        />
      </section>
      <section className="flex flex-col text-accent-foreground justify-center items-center gap-4 pb-8 border-b border-card">
        <h2 className="text-3xl font-bold mt-8 mb-4">Latest News</h2>
        <HomeNews news={homeContent.news} />
      </section>
      <section className="flex flex-col text-accent-foreground justify-center items-center gap-4 pb-8">
        <div className="max-w-1440 flex flex-col p-4 justify-center items-center gap-4">
          <h2 className="text-3xl font-bold mt-8">You have a suggestion ?</h2>
          <p>Don&apos;t hesitate to contact me !</p>
          <div className="flex gap-12">
            <Link
              href="mailto:jeremdev.contactpro@gmail.com"
              className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary focus:bg-secondary px-4 pt-2 pb-1 rounded hover:drop-shadow-light"
            >
              <Mail height={25} width={25} />
              <span>Mail</span>
            </Link>
            <Link
              href="https://x.com/JeremDevX"
              className="flex flex-col items-center justify-center hover:scale-110 hover:bg-secondary focus:bg-secondary px-2 pt-2 pb-1 rounded hover:drop-shadow-light"
              target="_blank"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                height={25}
                width={25}
                className="fill-foreground"
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
              <span>X(twitter)</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
