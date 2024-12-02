import { defineQuery, type SanityDocument } from "next-sanity";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Refractor, registerLanguage } from "react-refractor";
import tsx from "refractor/lang/tsx";
import { incrementViews } from "@/utils/incrementViews";
import Link from "next/link";
import ArrowTopOfPage from "@/components/custom/ArrowTopOfPage";

registerLanguage(tsx);

const customComponents: Partial<PortableTextReactComponents> = {
  types: {
    code: ({ value }: { value: SanityDocument }) => (
      <Refractor
        language={value.language}
        value={value.code}
        className="text-base"
      />
    ),
    image: ({ value }: { value: SanityImageSource }) => (
      <Image
        src={urlFor(value)?.url() || "https://via.placeholder.com/550x310"}
        alt=""
        width={100}
        height={100}
      />
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: HTMLLinkElement;
    }) => {
      if (value) {
        const rel = !value.href.startsWith("/") ? "noopener noreferrer" : "";
        const target = !value.href.startsWith("/") ? "_blank" : "";
        return (
          <Link href={value.href} rel={rel} target={target}>
            {children}
          </Link>
        );
      }
    },
  },
};

const options = { next: { revalidate: 30 } };

const POST_QUERY = defineQuery(`*[
  _type == "post" &&
  slug.current == $slug
  ][0]{_id, title, slug, date, coverImage, content, resume, view}`);

async function getPosts(params: { slug: string }) {
  const posts = await client.fetch(POST_QUERY, params, options);
  return posts;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getPosts(params);
  return {
    title: `TechHowlerX - ${post.title}`,
    description: post.resume,
  };
}

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function ArticlePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getPosts(params);

  if (!post) {
    notFound();
  }
  const { title, date, content, coverImage, _id } = post;
  const ImageUrl = coverImage
    ? urlFor(coverImage)?.width(550).height(310).url()
    : null;

  if (typeof window === "undefined") {
    try {
      await incrementViews(_id);
    } catch (error) {
      console.error("failed to increment", error);
    }
  }

  return (
    <section className="post__container">
      <Link href="/blog" className="post__back-link">
        &larr; Back to blog
      </Link>
      <Image
        src={ImageUrl || "https://via.placeholder.com/550x310"}
        alt=""
        className="post__img"
        height="810"
        width="810"
      />
      <div className="post__header">
        <h1 className="post__header-title">{title}</h1>
        <span className="post__header-date">
          Date : <time>{date}</time>
        </span>
      </div>
      <div className="post__content">
        <PortableText value={content} components={customComponents} />
      </div>
      <div className="post__return-top">
        <ArrowTopOfPage />
      </div>
    </section>
  );
}
