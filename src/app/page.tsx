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
  title: "TechHowlerX - Dev blog and utility tools",
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
            <span className="ml-0 md:ml-2">Dev blog and utility tools</span>
          </h1>
          <div className="flex xl:flex-row-reverse gap-8 xl:gap-0 items-center h-full relative">
            <div className="flex-1 relative justify-center items-center hidden md:flex">
              <Image
                src="/home-hero-image.png"
                height={750}
                width={1000}
                alt=""
                className="rounded-lg drop-shadow-light hidden md:block"
              />
            </div>
            <div className="flex flex-col flex-1 justify-center text-center xl:text-left h-full gap-8 relative w-full md:absolute inset-0 p-8 bg-gray-950 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 ring-1 xl:relative xl:p-0 xl:pr-8 xl:bg-transparent xl:ring-0">
              <div className="flex flex-col gap-4 sm:gap-12 xl:gap-4 border-b border-secondary pb-8">
                <p className="text-2xl font-semibold">
                  Weekly posts about tech, programming and more.
                  <br />
                  <span className="text-lg font-normal">
                    Every week, discover new content covering a variety of
                    topics, from software to hardware and everything on between.
                  </span>
                </p>
                <div className="flex flex-col gap-4 xs:flex-row xs:gap-8 justify-center items-center xl:items-start xl:justify-normal">
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
              <div className="flex flex-col gap-4 sm:gap-12 xl:gap-4">
                <p className="text-2xl font-bold">
                  Free and interactive dev tools.
                  <br />
                  <span className="text-lg font-normal">
                    Browse a wide range of tools like code formatters, CSS
                    utilities, and more
                  </span>
                </p>
                <div className="flex justify-center xl:justify-normal">
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
