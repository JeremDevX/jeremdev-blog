import { defineQuery, type SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Refractor, registerLanguage } from "react-refractor";
import tsx from "refractor/lang/tsx";
import urlBuilder from "@sanity/image-url";

registerLanguage(tsx);

const customComponents = {
  types: {
    code: ({ value }: { value: SanityDocument }) => (
      <Refractor language={value.language} value={value.code} />
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
};

const options = { next: { revalidate: 60 } };

const POST_QUERY = defineQuery(`*[
    _type == "post" &&
    slug.current == $slug
  ][0]{title, slug, date, coverImage, content}`);

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch(POST_QUERY, params, options);
  if (!post) {
    notFound();
  }
  const { name, date, content, coverImage } = post;
  const eventImageUrl = coverImage
    ? urlFor(coverImage)?.width(550).height(310).url()
    : null;

  return (
    <main className="mx-auto p-12 flex flex-col max-w-3xl">
      <div className="mb-4">
        <Link href="/">← Back to home</Link>
      </div>
      <div className="">
        <Image
          src={eventImageUrl || "https://via.placeholder.com/550x310"}
          alt={name || "Event"}
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
          height="310"
          width="550"
        />
        <PortableText value={content} components={customComponents} />
      </div>
    </main>
  );
}
